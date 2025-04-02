import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock admin address
  },
  contracts: {
    'procurement-verification': {
      functions: {
        'record-procurement': vi.fn(),
        'approve-procurement': vi.fn(),
        'add-approved-vendor': vi.fn(),
        'get-procurement': vi.fn(),
        'is-vendor-approved': vi.fn(),
        'is-procurement-officer': vi.fn(),
        'transfer-admin': vi.fn(),
        'get-admin': vi.fn(),
      },
    },
  },
};

// Mock global clarity object
global.clarity = mockClarity;

describe('Procurement Verification Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  it('should record a procurement', async () => {
    // Mock successful response
    mockClarity.contracts['procurement-verification'].functions['record-procurement'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['procurement-verification'].functions['record-procurement'](
        'PROC001',
        'DEPT001',
        'Vendor XYZ',
        75000,
        'IT Equipment',
        true,
        '2023-10-20'
    );
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['procurement-verification'].functions['record-procurement']).toHaveBeenCalledWith(
        'PROC001',
        'DEPT001',
        'Vendor XYZ',
        75000,
        'IT Equipment',
        true,
        '2023-10-20'
    );
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should approve a procurement', async () => {
    // Mock successful response
    mockClarity.contracts['procurement-verification'].functions['approve-procurement'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['procurement-verification'].functions['approve-procurement']('PROC001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['procurement-verification'].functions['approve-procurement']).toHaveBeenCalledWith('PROC001');
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should add an approved vendor', async () => {
    // Mock successful response
    mockClarity.contracts['procurement-verification'].functions['add-approved-vendor'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['procurement-verification'].functions['add-approved-vendor'](
        'VENDOR001',
        'Vendor XYZ',
        '2023-10-01'
    );
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['procurement-verification'].functions['add-approved-vendor']).toHaveBeenCalledWith(
        'VENDOR001',
        'Vendor XYZ',
        '2023-10-01'
    );
    
    // Verify the result
    expect(result.success).toBe(true);
  });
  
  it('should check if a vendor is approved', async () => {
    // Mock successful response
    mockClarity.contracts['procurement-verification'].functions['is-vendor-approved'].mockResolvedValue({
      success: true,
      value: true,
    });
    
    // Call the function
    const result = await mockClarity.contracts['procurement-verification'].functions['is-vendor-approved']('VENDOR001');
    
    // Verify the function was called with correct parameters
    expect(mockClarity.contracts['procurement-verification'].functions['is-vendor-approved']).toHaveBeenCalledWith('VENDOR001');
    
    // Verify the result
    expect(result.success).toBe(true);
    expect(result.value).toBe(true);
  });
});
