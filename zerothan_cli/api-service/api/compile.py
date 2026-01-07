from http.server import BaseHTTPRequestHandler
import json
from transpiler import PythonContractTranspiler

transpiler = PythonContractTranspiler()

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "service": "Zerothan Python Compiler",
            "status": "running",
            "version": "1.0.0",
            "compiler": "python-native",
            "runtime": "Vercel Python"
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body)
            source_code = data.get('code', '')
            
            if not source_code:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "errors": ["No code provided"]}).encode('utf-8'))
                return

            # Transpile
            result = transpiler.transpile(source_code)
            
            # Format successful result
            response = {
                "success": True,
                "bytecode": result.get("bytecode", ""),
                "abi": result.get("abi", []),
                "metadata": result.get("metadata", {}),
                "compiler": "zerothan-transpiler"
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "errors": [str(e)]}).encode('utf-8'))
