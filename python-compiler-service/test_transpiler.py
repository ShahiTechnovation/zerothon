import pytest
from zerothan_cli.transpiler import PythonContractTranspiler, ContractState

class TestTranspiler:
    def setup_method(self):
        self.transpiler = PythonContractTranspiler()

    def test_simple_storage(self):
        code = """
class SimpleStorage(PySmartContract):
    def __init__(self):
        self.value = 0
        
    def set(self, x: int):
        self.value = x
        
    def get(self) -> int:
        return self.value
"""
        result = self.transpiler.transpile(code)
        # assert result['success'] is not False # Removed as transpile returns dict directly
        assert result['bytecode'].startswith('0x')
        
        # Check metadata
        metadata = result['metadata']
        assert 'value' in metadata['state_variables']
        assert 'set' in metadata['functions']
        assert 'get' in metadata['functions']

    def test_arithmetic(self):
        code = """
class Calculator(PySmartContract):
    def add(self, a: int, b: int) -> int:
        return a + b
"""
        result = self.transpiler.transpile(code)
        assert result['bytecode'].startswith('0x')
        assert 'add' in result['metadata']['functions']

if __name__ == "__main__":
    t = TestTranspiler()
    t.setup_method()
    t.test_simple_storage()
    print("Simple storage test passed!")
    t.test_arithmetic()
    print("Arithmetic test passed!")
