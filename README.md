# pouchesitaly-com-manual-setup

Repository for `pouchesitaly.com`

## Deployment model

This site does **not** use Cloudflare Pages.

It is deployed through:
- **Google Cloud Build**
- **GKE / Kubernetes cluster**

## Deployment behavior

- Deployments are **automatic**
- You only need to **commit and push to the repo**
- Cloud Build builds the image and deploys it to the Kubernetes cluster

## Deployment source of truth

See:
- `cloudbuild.yaml` — build + deploy pipeline
- `Dockerfile` — image build
- `nginx/default.conf` — runtime web server config

## Important note for future work

For `https://pouchesitaly.com/`, assume:
- **auto-deploy on repo update**
- **not Cloudflare Pages**
- **not manual Pages publishing**
