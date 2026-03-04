import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DbProduct } from '@/hooks/useProducts';

type ConflictStrategy = 'skip' | 'update';
type ConflictCode =
  | 'duplicate_file_sku'
  | 'duplicate_file_name'
  | 'existing_sku'
  | 'existing_name'
  | 'ambiguous_existing_match';

interface ConflictEntry {
  code: ConflictCode;
  message: string;
}

interface CsvImportPayload {
  row_number: number;
  sku: string | null;
  name: string;
  brand: string;
  strength: string;
  strength_mg: number;
  flavor: string;
  price: number;
  stock_count: number;
  is_active: boolean;
  image: string | null;
  image_2: string | null;
  image_3: string | null;
  description: string | null;
  description_it: string | null;
  popularity: number;
}

interface ParsedCsvRow {
  rowNumber: number;
  payload: CsvImportPayload;
  errors: string[];
}

interface PreviewRow extends ParsedCsvRow {
  conflicts: ConflictEntry[];
}

interface ImportRowResult {
  row_number: number;
  action: 'inserted' | 'updated' | 'skipped' | 'error';
  id: string | null;
  name: string | null;
  sku: string | null;
  message: string;
}

interface ImportSummary {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
}

interface ImportResponse {
  summary: ImportSummary;
  rows: ImportRowResult[];
}

interface ProductCsvImportProps {
  existingProducts: DbProduct[];
  onImported: () => void;
}

const FIELD_ALIASES: Record<string, string[]> = {
  sku: ['sku', 'product_sku', 'item_code', 'code'],
  name: ['name', 'product_name', 'title'],
  brand: ['brand', 'manufacturer'],
  strength: ['strength', 'strength_level'],
  strength_mg: ['strength_mg', 'strengthmg', 'nicotine_mg', 'nicotine_mg_per_pouch'],
  flavor: ['flavor', 'flavour', 'taste', 'flavor_profile'],
  price: ['price', 'unit_price', 'regular_price'],
  stock_count: ['stock_count', 'stock', 'inventory', 'qty', 'quantity', 'in_stock_quantity'],
  is_active: ['is_active', 'enabled', 'active', 'is_enabled', 'availability'],
  image: ['image', 'image_url', 'main_image', 'image_1'],
  image_2: ['image_2', 'image2', 'secondary_image'],
  image_3: ['image_3', 'image3', 'third_image'],
  description: ['description', 'description_long', 'long_description', 'description_short'],
  description_it: ['description_it', 'description_italian', 'italian_description'],
  popularity: ['popularity', 'ranking_score', 'score'],
};

const TRUE_VALUES = new Set(['true', '1', 'yes', 'y', 'active', 'enabled', 'in_stock']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'n', 'inactive', 'disabled', 'out_of_stock']);

const normalizeHeader = (header: string) =>
  header
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

const normalizeKey = (value: string | null | undefined) => (value || '').trim().toLowerCase();
const normalizeSku = (value: string | null | undefined) => (value || '').trim().toUpperCase();

const parseCsvMatrix = (input: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (char === '\n' || char === '\r') {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell);
  const hasContent = row.some((part) => part.trim() !== '');
  if (hasContent) {
    rows.push(row);
  }

  return rows;
};

const getValue = (record: Record<string, string>, field: keyof typeof FIELD_ALIASES): string => {
  const aliases = FIELD_ALIASES[field];
  for (const alias of aliases) {
    const value = record[alias];
    if (value !== undefined && value !== null && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
};

const parseNumber = (raw: string): number | null => {
  if (!raw) return null;
  const normalized = raw.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBoolean = (raw: string, fallback: boolean): boolean => {
  const normalized = normalizeKey(raw);
  if (!normalized) return fallback;
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return fallback;
};

const buildParsedRows = (csvContent: string): ParsedCsvRow[] => {
  const matrix = parseCsvMatrix(csvContent).filter((row) => row.some((value) => value.trim() !== ''));
  if (matrix.length < 2) {
    throw new Error('CSV must include a header row and at least one product row.');
  }

  const headers = matrix[0].map((header) => normalizeHeader(header));
  const rows = matrix.slice(1);

  return rows.map((values, index) => {
    const rowNumber = index + 2;
    const record: Record<string, string> = {};
    headers.forEach((header, colIndex) => {
      record[header] = (values[colIndex] || '').trim();
    });

    const name = getValue(record, 'name');
    const brand = getValue(record, 'brand');
    const sku = getValue(record, 'sku');
    const strength = getValue(record, 'strength') || 'Regular';
    const strengthMgRaw = parseNumber(getValue(record, 'strength_mg'));
    const flavor = getValue(record, 'flavor') || 'Mint';
    const priceRaw = parseNumber(getValue(record, 'price'));
    const stockCountRaw = parseNumber(getValue(record, 'stock_count'));
    const popularityRaw = parseNumber(getValue(record, 'popularity'));
    const image = getValue(record, 'image');
    const image2 = getValue(record, 'image_2');
    const image3 = getValue(record, 'image_3');
    const description = getValue(record, 'description');
    const descriptionIt = getValue(record, 'description_it');
    const isActive = parseBoolean(getValue(record, 'is_active'), true);

    const errors: string[] = [];
    if (!name) errors.push('Missing product name');
    if (!brand) errors.push('Missing brand');
    if (priceRaw === null) errors.push('Missing or invalid price');

    const payload: CsvImportPayload = {
      row_number: rowNumber,
      sku: sku || null,
      name,
      brand,
      strength,
      strength_mg: Math.max(1, Math.round(strengthMgRaw ?? 6)),
      flavor,
      price: Math.max(0, Number((priceRaw ?? 0).toFixed(2))),
      stock_count: Math.max(0, Math.round(stockCountRaw ?? 0)),
      is_active: isActive,
      image: image || null,
      image_2: image2 || null,
      image_3: image3 || null,
      description: description || null,
      description_it: descriptionIt || null,
      popularity: Math.min(100, Math.max(1, Math.round(popularityRaw ?? 50))),
    };

    return { rowNumber, payload, errors };
  });
};

const buildPreviewRows = (rows: ParsedCsvRow[], existingProducts: DbProduct[]): PreviewRow[] => {
  const existingBySku = new Map<string, DbProduct>();
  const existingByName = new Map<string, DbProduct>();

  for (const product of existingProducts) {
    const skuKey = normalizeSku(product.sku);
    const nameKey = normalizeKey(product.name);
    if (skuKey && !existingBySku.has(skuKey)) existingBySku.set(skuKey, product);
    if (nameKey && !existingByName.has(nameKey)) existingByName.set(nameKey, product);
  }

  const seenSku = new Map<string, number>();
  const seenName = new Map<string, number>();

  return rows.map((row) => {
    const conflicts: ConflictEntry[] = [];
    const skuKey = normalizeSku(row.payload.sku);
    const nameKey = normalizeKey(row.payload.name);

    if (skuKey) {
      const duplicateSkuRow = seenSku.get(skuKey);
      if (duplicateSkuRow) {
        conflicts.push({
          code: 'duplicate_file_sku',
          message: `Duplicate SKU in CSV (also row ${duplicateSkuRow})`,
        });
      } else {
        seenSku.set(skuKey, row.rowNumber);
      }
    }

    if (nameKey) {
      const duplicateNameRow = seenName.get(nameKey);
      if (duplicateNameRow) {
        conflicts.push({
          code: 'duplicate_file_name',
          message: `Duplicate name in CSV (also row ${duplicateNameRow})`,
        });
      } else {
        seenName.set(nameKey, row.rowNumber);
      }
    }

    const skuMatch = skuKey ? existingBySku.get(skuKey) : undefined;
    const nameMatch = nameKey ? existingByName.get(nameKey) : undefined;

    if (skuMatch) {
      conflicts.push({
        code: 'existing_sku',
        message: `SKU already exists (${skuMatch.name})`,
      });
    }

    if (nameMatch) {
      conflicts.push({
        code: 'existing_name',
        message: `Name already exists (${nameMatch.name})`,
      });
    }

    if (skuMatch && nameMatch && skuMatch.id !== nameMatch.id) {
      conflicts.push({
        code: 'ambiguous_existing_match',
        message: 'SKU matches one existing product while name matches another',
      });
    }

    return { ...row, conflicts };
  });
};

const rowWillImport = (row: PreviewRow, strategy: ConflictStrategy) => {
  if (row.errors.length > 0) return false;
  if (row.conflicts.length === 0) return true;

  if (strategy === 'skip') return false;

  const nonUpdatableConflict = row.conflicts.some(
    (conflict) =>
      conflict.code === 'duplicate_file_name' ||
      conflict.code === 'duplicate_file_sku' ||
      conflict.code === 'ambiguous_existing_match',
  );
  return !nonUpdatableConflict;
};

export function ProductCsvImport({ existingProducts, onImported }: ProductCsvImportProps) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedCsvRow[]>([]);
  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>('skip');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const { toast } = useToast();

  const previewRows = useMemo(
    () => buildPreviewRows(parsedRows, existingProducts),
    [existingProducts, parsedRows],
  );

  const previewStats = useMemo(() => {
    let invalid = 0;
    let conflicts = 0;
    let ready = 0;
    let importable = 0;

    for (const row of previewRows) {
      if (row.errors.length > 0) {
        invalid += 1;
      } else if (row.conflicts.length > 0) {
        conflicts += 1;
      } else {
        ready += 1;
      }

      if (rowWillImport(row, conflictStrategy)) {
        importable += 1;
      }
    }

    return { total: previewRows.length, invalid, conflicts, ready, importable };
  }, [conflictStrategy, previewRows]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const rows = buildParsedRows(content);
      setFileName(file.name);
      setParsedRows(rows);
      setImportResult(null);
      toast({
        title: 'CSV parsed',
        description: `${rows.length} rows loaded for preview.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse CSV file';
      toast({ title: 'Invalid CSV', description: message, variant: 'destructive' });
      setParsedRows([]);
      setImportResult(null);
      setFileName(file.name);
    } finally {
      event.target.value = '';
    }
  };

  const handleImport = async () => {
    if (previewRows.length === 0) {
      toast({ title: 'No rows to import', variant: 'destructive' });
      return;
    }

    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: {
          operation: 'rpc',
          data: {
            function: 'import_products',
            conflict_strategy: conflictStrategy,
            rows: previewRows.map((row) => row.payload),
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result = data?.data as ImportResponse;
      setImportResult(result);
      onImported();

      toast({
        title: 'Import completed',
        description: `Inserted ${result.summary.inserted}, updated ${result.summary.updated}, skipped ${result.summary.skipped}, errors ${result.summary.errors}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed';
      toast({ title: 'Import failed', description: message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Import Products From CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV, preview incoming changes, review SKU/name conflicts, then import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
            </div>
            {fileName ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="w-4 h-4" />
                <span>{fileName}</span>
              </div>
            ) : null}
          </div>

          {previewRows.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-semibold">{previewStats.total}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Ready</p>
                  <p className="text-xl font-semibold text-emerald-600">{previewStats.ready}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Conflicts</p>
                  <p className="text-xl font-semibold text-amber-600">{previewStats.conflicts}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Invalid</p>
                  <p className="text-xl font-semibold text-red-600">{previewStats.invalid}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Will Import</p>
                  <p className="text-xl font-semibold">{previewStats.importable}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
                <div className="space-y-2">
                  <Label>Conflict handling</Label>
                  <Select value={conflictStrategy} onValueChange={(value) => setConflictStrategy(value as ConflictStrategy)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip conflicting rows</SelectItem>
                      <SelectItem value="update">Update existing product on SKU/Name match</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Duplicate rows inside the same CSV are always skipped to avoid accidental double imports.
                  </p>
                </div>

                <div className="rounded-lg border overflow-auto max-h-[340px]">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Row</th>
                        <th className="p-2 text-left">SKU</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Brand</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Stock</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewRows.map((row) => {
                        const issues = [...row.errors, ...row.conflicts.map((conflict) => conflict.message)];
                        const willImport = rowWillImport(row, conflictStrategy);

                        return (
                          <tr key={`${row.rowNumber}-${row.payload.name}`}>
                            <td className="p-2 align-top">{row.rowNumber}</td>
                            <td className="p-2 align-top">{row.payload.sku || '-'}</td>
                            <td className="p-2 align-top">{row.payload.name || '-'}</td>
                            <td className="p-2 align-top">{row.payload.brand || '-'}</td>
                            <td className="p-2 align-top">EUR {row.payload.price.toFixed(2)}</td>
                            <td className="p-2 align-top">{row.payload.stock_count}</td>
                            <td className="p-2 align-top">
                              <div className="space-y-1">
                                {row.errors.length > 0 ? (
                                  <Badge variant="destructive">Invalid</Badge>
                                ) : row.conflicts.length > 0 ? (
                                  <Badge variant="secondary">{willImport ? 'Will Update' : 'Conflict'}</Badge>
                                ) : (
                                  <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">Ready</Badge>
                                )}
                                {issues.slice(0, 2).map((issue, issueIndex) => (
                                  <p key={issueIndex} className="text-xs text-muted-foreground">{issue}</p>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Upload a CSV file to preview rows before import.
            </div>
          )}

          {importResult ? (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                {importResult.summary.errors > 0 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <p className="text-sm font-medium">
                  Import result: {importResult.summary.inserted} inserted, {importResult.summary.updated} updated, {importResult.summary.skipped} skipped, {importResult.summary.errors} errors
                </p>
              </div>
              <div className="max-h-36 overflow-auto rounded border">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Row</th>
                      <th className="p-2 text-left">Action</th>
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {importResult.rows.map((row) => (
                      <tr key={`${row.row_number}-${row.action}-${row.id || 'none'}`}>
                        <td className="p-2">{row.row_number}</td>
                        <td className="p-2">{row.action}</td>
                        <td className="p-2">{row.id || '-'}</td>
                        <td className="p-2">{row.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={importing}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={importing || previewStats.importable === 0}
          >
            {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Import {previewStats.importable > 0 ? `(${previewStats.importable})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
