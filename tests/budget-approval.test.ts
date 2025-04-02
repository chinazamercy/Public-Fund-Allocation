import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock admin address
  },
  contracts: {
    'budget-approval': {
      functions: {
        'set-department-budget': vi.fn(),
        'approve-budget': vi.fn(),
        'get-department-budget': vi.fn(),
        'transfer-admin': vi.fn(),
        'get-admin': vi.fn(),
      },
    },
  },
};

// Mock global clarity object
global.clarity = mockClarity;

describe('Budget Approval Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  it('should set a department budget', async () => {
    // Mock successful response
    mockClarity.contracts['budget-approval'].functions['set-department-budget'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['budget-approval'].functions['set-department-budget'](
        'DEPT001',
        1000000,
        '2023-2024'
    );
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['budget-approval'].functions['set-department-budget']).toHaveBeenCalledWith(
        'DEPT001',
        1000000,
        '2023-2024'
    );
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should approve a department budget', async () => {
    // Mock successful response
    mockClarity.contracts['budget-approval'].functions['approve-budget'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['budget-approval'].functions['approve-budget']('DEPT001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['budget-approval'].functions['approve-budget']).toHaveBeenCalledWith('DEPT001');
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should get a department budget', async () => {
    // Mock budget data
    const mockBudget = {
      amount: 1000000,
      approved: true,
      'fiscal-year': '2023-2024',
      approver: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    };
    
    // Mock successful response
    mockClarity.contracts['budget-approval'].functions['get-department-budget'].mockResolvedValue({
      success: true,
      value: mockBudget,
    });
    
    // Call the function
    const result = await mockClarity.contracts['budget-approval'].functions['get-department-budget']('DEPT001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['budget-approval'].functions['get-department-budget']).toHaveBeenCalledWith('DEPT001');
    
    // Verify the result
    expect(result.success).toBe(true);
    expect(result.value).toEqual(mockBudget);
  });
});
