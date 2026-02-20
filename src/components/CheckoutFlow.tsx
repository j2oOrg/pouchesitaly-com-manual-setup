import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/types/product";

interface CheckoutFlowProps {
  cart: CartItem[];
  onComplete: () => void;
  onBack?: () => void;
}

type CheckoutStep = "details" | "creating" | "payment" | "success" | "error";

interface KustomSession {
  orderId: string;
  kustomOrderId: string;
  kustomOrderToken: string;
  htmlSnippet: string;
  checkoutUrl?: string;
}

export function CheckoutFlow({ cart, onComplete, onBack }: CheckoutFlowProps) {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<CheckoutStep>("details");
  const [session, setSession] = useState<KustomSession | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const sessionRef = useRef<KustomSession | null>(null);
  const isBusyRef = useRef(false);

  const addDebug = (event: string, details: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.debug(`[CheckoutFlow] ${new Date().toLocaleTimeString()} ${event}`, details);
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    setIsBusy(true);
    isBusyRef.current = true;
    setStep("creating");
    setStatusMessage(null);
    addDebug("handleSubmit.start", {
      cartItems: cart.length,
      total: Number(total.toFixed(2)),
      locale: language,
    });

    const { data, error } = await supabase.functions.invoke("kustom-checkout", {
      body: {
        operation: "create_checkout",
        locale: language,
        currency: "EUR",
        customer: formData,
        cart,
      },
    });

    const payload = data as {
      success?: boolean;
      data?: {
        order_id?: string;
        kustom_order_id?: string;
        kustom_order_token?: string;
        html_snippet?: string;
        checkout_url?: string;
        request_id?: string;
      };
      error?: string;
      request_id?: string;
    };

    const responseRequestId =
      payload?.request_id ||
      payload?.data?.request_id ||
      ((error as { context?: { body?: { request_id?: string } } })?.context?.body?.request_id ?? null);
    if (responseRequestId) {
      addDebug("handleSubmit.responseId", { request_id: responseRequestId });
    }

    addDebug("handleSubmit.response", {
      hasError: !!error,
      hasData: !!data,
      dataSuccess: payload?.success,
      hasSessionData: !!payload?.data,
      apiError: error?.message || null,
    });

    if (error) {
      setIsBusy(false);
      isBusyRef.current = false;
      setStatusMessage(error.message || t("checkoutError"));
      setStep("error");
      addDebug("handleSubmit.error", {
        message: error.message || t("checkoutError"),
      });
      return;
    }

    if (!payload?.success || !payload?.data) {
      setIsBusy(false);
      isBusyRef.current = false;
      setStatusMessage(payload?.error || t("checkoutError"));
      setStep("error");
      return;
    }

    if (!payload.data.order_id || !payload.data.kustom_order_id || !payload.data.html_snippet) {
      setIsBusy(false);
      isBusyRef.current = false;
      setStatusMessage(t("checkoutSnippetMissing"));
      setStep("error");
      return;
    }

    setSession({
      orderId: payload.data.order_id,
      kustomOrderId: payload.data.kustom_order_id,
      kustomOrderToken: payload.data.kustom_order_token || "",
      htmlSnippet: payload.data.html_snippet,
      checkoutUrl: payload.data.checkout_url,
    });
    addDebug("handleSubmit.sessionReady", {
      orderId: payload.data.order_id,
      kustomOrderId: payload.data.kustom_order_id,
      htmlSnippetLength: payload.data.html_snippet?.length || 0,
      hasCheckoutUrl: !!payload.data.checkout_url,
      responseRequestId: responseRequestId,
    });
    setStep("payment");
    addDebug("handleSubmit.stepChanged", { step: "payment" });
    setIsBusy(false);
    isBusyRef.current = false;
  };

  const handlePaymentCheck = async () => {
    const activeSession = sessionRef.current;
    if (!activeSession || isBusyRef.current) return;

    setIsBusy(true);
    isBusyRef.current = true;
    setStatusMessage(t("paymentChecking"));
    addDebug("paymentCheck.start", { orderId: activeSession.orderId });

    const { data, error } = await supabase.functions.invoke("kustom-checkout", {
      body: {
        operation: "mark_paid",
        order_id: activeSession.orderId,
        kustom_order_id: activeSession.kustomOrderId,
        kustom_order_token: activeSession.kustomOrderToken,
      },
    });

    const payload = data as {
      success?: boolean;
      data?: {
        payment_confirmed?: boolean;
        status?: string;
        kustom_status?: string;
      };
      error?: string;
      request_id?: string;
    };

    const paymentResponseRequestId =
      payload?.request_id ||
      ((error as { context?: { body?: { request_id?: string } } })?.context?.body?.request_id ?? null);
    if (paymentResponseRequestId) {
      addDebug("paymentCheck.responseId", { request_id: paymentResponseRequestId });
    }

    addDebug("paymentCheck.response", {
      hasError: !!error,
      hasData: !!data,
      requestId: payload?.request_id,
      success: payload?.success,
    });

    if (error) {
      setIsBusy(false);
      isBusyRef.current = false;
      setStatusMessage(error.message || t("checkoutError"));
      setStep("error");
      return;
    }

    if (payload?.success && payload.data?.payment_confirmed) {
      setStatusMessage(t("paymentConfirmed"));
      setStep("success");
      setIsBusy(false);
      isBusyRef.current = false;
      return;
    }

    if (payload?.success && payload.data) {
      setStatusMessage(t("paymentPending"));
      setStep("payment");
      setIsBusy(false);
      isBusyRef.current = false;
      return;
    }

    setIsBusy(false);
    isBusyRef.current = false;
    setStatusMessage(payload?.error || t("checkoutError"));
    setStep("error");
  };

  useEffect(() => {
    addDebug("render.step", { step });
  }, [step]);

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (step !== "payment" || !session?.orderId) return;

    let pollCount = 0;
    const maxPollCount = 60;
    let pollInterval: ReturnType<typeof setInterval>;

    addDebug("payment.autoPoll.start", {
      orderId: session.orderId,
      maxPollCount,
    });

    pollInterval = window.setInterval(async () => {
      if (isBusyRef.current) {
        addDebug("payment.autoPoll.skipped", {
          reason: "busy",
          attempt: pollCount,
        });
        return;
      }

      pollCount += 1;
      addDebug("payment.autoPoll.tick", { attempt: pollCount, orderId: session.orderId });
      await handlePaymentCheck();

      if (pollCount >= maxPollCount) {
        addDebug("payment.autoPoll.stop", {
          reason: "maxAttemptsReached",
          attempts: pollCount,
        });
        clearInterval(pollInterval);
      }
    }, 5000);

    const listener = (event: MessageEvent) => {
      if (!event.origin.includes("kustom.co") && !event.origin.includes("klarna.com")) {
        return;
      }

      addDebug("payment.iframeMessage", {
        origin: event.origin,
        eventType: typeof event.data,
        eventData: JSON.stringify(event.data),
      });
    };

    window.addEventListener("message", listener);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("message", listener);
      addDebug("payment.autoPoll.stop", {
        reason: "unmountedOrStepChanged",
        attempts: pollCount,
      });
    };
    }, [session?.orderId, step]);

  useEffect(() => {
    addDebug("flow.mount", {});
    return () => addDebug("flow.unmount", {});
  }, []);

  const handleReset = () => {
    setSession(null);
    setStatusMessage(null);
    setStep("details");
    addDebug("handleReset", { step: "details" });
  };

  const handleBack = () => {
    setSession(null);
    setStatusMessage(null);
    setStep("details");
    addDebug("handleBack", { step: "details" });
    onBack?.();
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm w-full h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur z-10">
        <h2 className="font-heading font-bold text-xl">
          {step === "success"
            ? t("orderComplete")
            : step === "creating"
              ? t("creatingCheckout")
              : t("checkout")}
        </h2>
        {onBack ? (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
        ) : null}
      </div>

        {step === "details" && (
          <form
            onSubmit={handleSubmit}
            className="p-6 min-h-0 flex-1 flex flex-col"
          >
            <div className="bg-muted rounded-xl p-4 mb-6">
              <h3 className="font-heading font-semibold mb-3">Order Summary</h3>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.packSize}`}
                  className="flex justify-between text-sm py-1"
                >
                  <span>
                    {item.name} ({item.packSize} {t("cans")}) × {item.quantity}
                  </span>
                  <span className="font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border mt-3 pt-3 flex justify-between font-heading font-bold">
                <span>{t("total")}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

              <h3 className="font-heading font-semibold mb-4">{t("shippingDetails")}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6 flex-1 min-h-0 overflow-y-auto">
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">{t("city")}</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">{t("postalCode")}</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 mt-auto"
              disabled={isBusy}
            >
              {isBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t("placeOrder")}
            </Button>
          </form>
        )}

        {step === "creating" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/12 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">{t("creatingCheckout")}</h3>
          </div>
        )}

        {step === "payment" && session && (
          <div className="p-6 min-h-0 h-full flex flex-col overflow-hidden">
            <div className="rounded-xl border border-dashed border-primary/30 overflow-hidden bg-white min-h-0 flex-1">
            <iframe
                className="w-full h-full"
                title="Kustom secure checkout"
                srcDoc={session.htmlSnippet}
                onLoad={() => {
                  addDebug("payment.iframeLoad", {
                    orderId: session.orderId,
                    kustomOrderId: session.kustomOrderId,
                  });
                }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups allow-downloads"
              />
            </div>

            {session.checkoutUrl && (
              <a
                href={session.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm text-primary underline underline-offset-4"
              >
                {t("openCheckoutInNewTab") || "Open checkout in new tab"}
              </a>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="sm:order-1"
                onClick={handleReset}
                disabled={isBusy}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("back")}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/12 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2">{t("orderComplete")}</h3>
            <p className="text-muted-foreground mb-6">
              {statusMessage || t("orderConfirmation")}
            </p>
            <Button
              onClick={() => {
                onComplete();
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              Continue Shopping
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-destructive/12 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">{t("checkoutError")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {statusMessage || t("orderConfirmation")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="outline" className="sm:order-1" onClick={handleReset}>
                {t("back")}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground sm:order-2"
                onClick={() => {
                  setStep("details");
                  setSession(null);
                  setStatusMessage(null);
                  addDebug("error.retry", {});
                }}
              >
                {t("retry")}
              </Button>
            </div>
          </div>
        )}

      </div>
  );
}
