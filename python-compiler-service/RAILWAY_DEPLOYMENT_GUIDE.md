# Deploying zerothon Python Compiler to Railway

This guide explains how to deploy the zerothon Python Compiler Service to Railway, enabling native Python smart contract compilation for your dapp.

## Prerequisites

-   A Railway account (https://railway.app)
-   GitHub repository connected to Railway

## Quick Deployment (Windows)

We have created an automated deployment script for you.

1.  Open a terminal in `python-compiler-service`.
2.  Run the deployment script:
    ```cmd
    .\deploy_railway.bat
    ```
3.  Follow the on-screen prompts to login and select your project.

## Manual CLI Deployment

1.  **Install Railway CLI** (Already installed)
    ```bash
    npm install -g @railway/cli
    ```

2.  **Login**
    ```bash
    railway login
    ```

3.  **Deploy**
    ```bash
    railway up
    ```

4.  **Get URL**
    After deployment, run:
    ```bash
    railway domain
    ```
    Copy the domain (e.g., `xxx.up.railway.app`) for the next step.

4.  **Environment Variables**
    -   No special environment variables are required for the service itself.
    -   Railway will automatically assign a `PORT`.

5.  **Expose the Service**
    -   Go to **Settings** > **Networking**.
    -   Click "Generate Domain" to get a public URL (e.g., `https://python-compiler-production.up.railway.app`).

## Connecting Frontend to Backend

Once deployed, you need to tell your Next.js app where to find the compiler.

1.  Copy the generated Railway URL.
2.  In your Vercel (or local `.env.local`) configuration for the Next.js app:
    ```env
    PYTHON_COMPILER_URL=https://your-railway-url.app
    ```
3.  Redeploy your Next.js frontend.

## Verification

To verify the service is running:
1.  Visit `https://your-railway-url.app/`
2.  You should see a JSON response:
    ```json
    {
      "service": "zerothon Python Compiler",
      "status": "running",
      "version": "1.0.0",
      "compiler": "zerothon-evm-transpiler"
    }
    ```

## Local Development

To run the compiler locally:

```bash
cd python-compiler-service
pip install -r requirements.txt
python main.py
```

The service will start on `http://localhost:8000`.
