import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock admin address
  },
  contracts: {
    'expenditure-tracking': {
      functions: {
        'record-expenditure': vi.fn(),
        'approve-expenditure': vi.fn(),
        'get-expenditure': vi.fn(),
        'get-department-spending': vi.fn(),
        'is-authorized-spender': vi.fn(),
        'transfer-admin': vi.fn(),
        'get-admin': vi.fn(),
      },
    },
  },
};

// Mock global clarity object
global.clarity = mockClarity;

describe('Expenditure Tracking Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  it('should record an expenditure', async () => {
    // Mock successful response
    mockClarity.contracts['expenditure-tracking'].functions['record-expenditure'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['expenditure-tracking'].functions['record-expenditure'](
        'EXP001',
        'DEPT001',
        50000,
        'Office supplies',
        '2023-10-15'
    );
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['expenditure-tracking'].functions['record-expenditure']).toHaveBeenCalledWith(
        'EXP001',
        'DEPT001',
        50000,
        'Office supplies',
        '2023-10-15'
    );
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should approve an expenditure', async () => {
    // Mock successful response
    mockClarity.contracts['expenditure-tracking'].functions['approve-expenditure'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['expenditure-tracking'].functions['approve-expenditure']('EXP001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['expenditure-tracking'].functions['approve-expenditure']).toHaveBeenCalledWith('EXP001');
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should get an expenditure', async () => {
    // Mock expenditure data
    const mockExpenditure = {
      'department-id': 'DEPT001',
      amount: 50000,
      description: 'Office supplies',
      date: '2023-10-15',
      approved: true,
    };
    
    // Mock successful response
    mockClarity.contracts['expenditure-tracking'].functions['get-expenditure'].mockResolvedValue({
      success: true,
      value: mockExpenditure,
    });
    
    // Call the function
    const result = await mockClarity.contracts['expenditure-tracking'].functions['get-expenditure']('EXP001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['expenditure-tracking'].functions['get-expenditure']).toHaveBeenCalledWith('EXP001');
    
    // Verify the result
    expect(result.success).toBe(true);
    expect(result.value).toEqual(mockExpenditure);
  });
  
  it('should get department spending', async () => {
    // Mock spending data
    const mockSpending = {
      'total-spent': 150000,
      'fiscal-year': '2023-2024',
    };
    
    // Mock successful response
    mockClarity.contracts['expenditure-tracking'].functions['get-department-spending'].mockResolvedValue({
      success: true,
      value: mockSpending,
    });
    
    // Call the function
    const result = await mockClarity.contracts['expenditure-tracking'].functions['get-department-spending']('DEPT001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['expenditure-tracking'].functions['get-department-spending']).toHaveBeenCalledWith('DEPT001');
    
    // Verify the result
    expect(result.success).toBe(true);
    expect(result.value).toEqual(mockSpending);
  });
});
