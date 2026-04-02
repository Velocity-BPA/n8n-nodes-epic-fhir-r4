/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { EpicFHIRR4 } from '../nodes/Epic FHIR R4/Epic FHIR R4.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('EpicFHIRR4 Node', () => {
  let node: EpicFHIRR4;

  beforeAll(() => {
    node = new EpicFHIRR4();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Epic FHIR R4');
      expect(node.description.name).toBe('epicfhirr4');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 10 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(10);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(10);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Patient Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-access-token', 
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('searchPatients operation', () => {
    it('should search patients successfully', async () => {
      const mockResponse = {
        resourceType: 'Bundle',
        entry: [{ resource: { resourceType: 'Patient', id: '123' } }]
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchPatients')
        .mockReturnValueOnce('John')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePatientOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient?name=John',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        json: true
      });
    });

    it('should handle search error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('searchPatients');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePatientOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPatient operation', () => {
    it('should get patient by ID successfully', async () => {
      const mockResponse = { resourceType: 'Patient', id: '123' };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPatient')
        .mockReturnValueOnce('123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePatientOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/123',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        json: true
      });
    });
  });

  describe('getPatientEverything operation', () => {
    it('should get patient everything successfully', async () => {
      const mockResponse = {
        resourceType: 'Bundle',
        entry: [
          { resource: { resourceType: 'Patient', id: '123' } },
          { resource: { resourceType: 'Observation', id: '456' } }
        ]
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPatientEverything')
        .mockReturnValueOnce('123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePatientOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/123/$everything',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        json: true
      });
    });
  });
});

describe('Observation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('searchObservations', () => {
    it('should search observations successfully', async () => {
      const mockResponse = {
        resourceType: 'Bundle',
        entry: [{ resource: { resourceType: 'Observation', id: 'obs1' } }]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchObservations')
        .mockReturnValueOnce('Patient/123')
        .mockReturnValueOnce('vital-signs')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('final');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeObservationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation?patient=Patient%2F123&category=vital-signs&status=final',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle search observations error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('searchObservations');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeObservationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getObservation', () => {
    it('should get observation successfully', async () => {
      const mockResponse = { resourceType: 'Observation', id: 'obs1' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getObservation')
        .mockReturnValueOnce('obs1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeObservationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation/obs1',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('createObservation', () => {
    it('should create observation successfully', async () => {
      const observationData = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '8480-6' }] }
      };
      const mockResponse = { ...observationData, id: 'obs1' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createObservation')
        .mockReturnValueOnce(observationData);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeObservationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        body: observationData,
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('updateObservation', () => {
    it('should update observation successfully', async () => {
      const observationData = {
        resourceType: 'Observation',
        id: 'obs1',
        status: 'amended'
      };
      const mockResponse = observationData;

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateObservation')
        .mockReturnValueOnce('obs1')
        .mockReturnValueOnce(observationData);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeObservationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation/obs1',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json',
          'Content-Type': 'application/fhir+json'
        },
        body: observationData,
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Medication Request Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should search medication requests successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('searchMedicationRequests')
			.mockReturnValueOnce('patient123')
			.mockReturnValueOnce('active')
			.mockReturnValueOnce('order')
			.mockReturnValueOnce('2023-01-01');

		const mockResponse = {
			resourceType: 'Bundle',
			total: 1,
			entry: [{ resource: { resourceType: 'MedicationRequest', id: 'med123' } }]
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeMedicationRequestOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 }
		}]);
	});

	it('should get medication request by ID successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getMedicationRequest')
			.mockReturnValueOnce('med123');

		const mockResponse = {
			resourceType: 'MedicationRequest',
			id: 'med123',
			status: 'active'
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeMedicationRequestOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 }
		}]);
	});

	it('should create medication request successfully', async () => {
		const requestBody = {
			resourceType: 'MedicationRequest',
			status: 'active',
			intent: 'order',
			subject: { reference: 'Patient/123' }
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createMedicationRequest')
			.mockReturnValueOnce(requestBody);

		const mockResponse = {
			...requestBody,
			id: 'new-med123'
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeMedicationRequestOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([{
			json: mockResponse,
			pairedItem: { item: 0 }
		}]);
	});

	it('should update medication request successfully', async () => {
		const requestBody = {
			resourceType: 'MedicationRequest',
			id: 'med123',
			status: 'on-hold',
			intent: 'order'
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateMedicationRequest')
			.mockReturnValueOnce('med123')
			.mockReturnValueOnce(requestBody);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(requestBody);

		const items = [{ json: {} }];
		const result = await executeMedicationRequestOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([{
			json: requestBody,
			pairedItem: { item: 0 }
		}]);
	});

	it('should handle API errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getMedicationRequest')
			.mockReturnValueOnce('invalid-id');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Resource not found'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const items = [{ json: {} }];
		const result = await executeMedicationRequestOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([{
			json: { error: 'Resource not found' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(
			executeMedicationRequestOperations.call(mockExecuteFunctions, items)
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Medication Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('searchMedications', () => {
		it('should search medications successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchMedications')
				.mockReturnValueOnce('aspirin')
				.mockReturnValueOnce('tablet')
				.mockReturnValueOnce('');

			const mockResponse = {
				resourceType: 'Bundle',
				entry: [{ resource: { resourceType: 'Medication', id: 'med1' } }],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMedicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Medication?code=aspirin&form=tablet',
				headers: {
					'Authorization': 'Bearer test-token',
					'Accept': 'application/fhir+json',
					'Content-Type': 'application/fhir+json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle search medications error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchMedications')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMedicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getMedication', () => {
		it('should get medication by ID successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMedication')
				.mockReturnValueOnce('med123');

			const mockResponse = {
				resourceType: 'Medication',
				id: 'med123',
				code: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '1234' }] },
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMedicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Medication/med123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Accept': 'application/fhir+json',
					'Content-Type': 'application/fhir+json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle get medication error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMedication')
				.mockReturnValueOnce('invalid-id');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Medication not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMedicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Medication not found' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Appointment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('searchAppointments', () => {
		it('should search appointments successfully', async () => {
			const mockResponse = {
				resourceType: 'Bundle',
				entry: [{ resource: { resourceType: 'Appointment', id: '123' } }],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchAppointments')
				.mockReturnValueOnce('patient123')
				.mockReturnValueOnce('practitioner456')
				.mockReturnValueOnce('2023-12-01')
				.mockReturnValueOnce('booked');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Appointment?patient=patient123&practitioner=practitioner456&date=2023-12-01&status=booked',
				headers: {
					'Authorization': 'Bearer test-token',
					'Accept': 'application/fhir+json',
				},
				json: true,
			});
		});

		it('should handle search appointments error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('searchAppointments');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAppointment', () => {
		it('should get appointment by ID successfully', async () => {
			const mockResponse = { resourceType: 'Appointment', id: '123' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAppointment')
				.mockReturnValueOnce('123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createAppointment', () => {
		it('should create appointment successfully', async () => {
			const appointmentData = { resourceType: 'Appointment', status: 'proposed' };
			const mockResponse = { resourceType: 'Appointment', id: '123', status: 'proposed' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createAppointment')
				.mockReturnValueOnce(appointmentData);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateAppointment', () => {
		it('should update appointment successfully', async () => {
			const appointmentData = { resourceType: 'Appointment', id: '123', status: 'booked' };
			const mockResponse = appointmentData;

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateAppointment')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce(appointmentData);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('patchAppointment', () => {
		it('should patch appointment successfully', async () => {
			const patchData = [{ op: 'replace', path: '/status', value: 'cancelled' }];
			const mockResponse = { resourceType: 'Appointment', id: '123', status: 'cancelled' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('patchAppointment')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce(patchData);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Practitioner Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('searchPractitioners', () => {
    it('should search practitioners successfully', async () => {
      const mockResponse = {
        resourceType: 'Bundle',
        total: 1,
        entry: [
          {
            resource: {
              resourceType: 'Practitioner',
              id: 'prac123',
              name: [{ family: 'Smith', given: ['John'] }]
            }
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchPractitioners')
        .mockReturnValueOnce('Smith')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePractitionerOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Practitioner?name=Smith',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json'
        },
        json: true
      });
    });

    it('should handle search error gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchPractitioners');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Search failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePractitionerOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Search failed');
    });
  });

  describe('getPractitioner', () => {
    it('should get practitioner by ID successfully', async () => {
      const mockResponse = {
        resourceType: 'Practitioner',
        id: 'prac123',
        name: [{ family: 'Smith', given: ['John'] }]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPractitioner')
        .mockReturnValueOnce('prac123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePractitionerOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Practitioner/prac123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Accept': 'application/fhir+json'
        },
        json: true
      });
    });

    it('should handle get practitioner error gracefully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPractitioner')
        .mockReturnValueOnce('invalid-id');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Practitioner not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePractitionerOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Practitioner not found');
    });
  });
});

describe('Condition Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should search conditions successfully', async () => {
		const mockResponse = {
			resourceType: 'Bundle',
			entry: [{ resource: { resourceType: 'Condition', id: 'test-condition-id' } }]
		};
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('searchConditions')
			.mockReturnValueOnce('eKRB5S74vdkWNVLMHNpKNlQ3')
			.mockReturnValueOnce('problem-list-item')
			.mockReturnValueOnce('active')
			.mockReturnValueOnce('I10');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition?patient=eKRB5S74vdkWNVLMHNpKNlQ3&category=problem-list-item&clinical-status=active&code=I10',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
				'Content-Type': 'application/fhir+json',
			},
			json: true,
		});
	});

	it('should get specific condition successfully', async () => {
		const mockResponse = { resourceType: 'Condition', id: 'test-condition-id' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCondition')
			.mockReturnValueOnce('test-condition-id');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition/test-condition-id',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
				'Content-Type': 'application/fhir+json',
			},
			json: true,
		});
	});

	it('should create condition successfully', async () => {
		const mockConditionData = { resourceType: 'Condition', subject: { reference: 'Patient/123' } };
		const mockResponse = { resourceType: 'Condition', id: 'new-condition-id' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createCondition')
			.mockReturnValueOnce(mockConditionData);
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
				'Content-Type': 'application/fhir+json',
			},
			body: mockConditionData,
			json: true,
		});
	});

	it('should update condition successfully', async () => {
		const mockConditionData = { resourceType: 'Condition', id: 'test-condition-id' };
		const mockResponse = { resourceType: 'Condition', id: 'test-condition-id' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateCondition')
			.mockReturnValueOnce('test-condition-id')
			.mockReturnValueOnce(mockConditionData);
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition/test-condition-id',
			headers: {
				'Authorization': 'Bearer test-token',
				'Accept': 'application/fhir+json',
				'Content-Type': 'application/fhir+json',
			},
			body: mockConditionData,
			json: true,
		});
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('searchConditions');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }]);
		
		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('searchConditions');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeConditionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Encounter Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should search encounters successfully', async () => {
    const mockResponse = { resourceType: 'Bundle', entry: [] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('searchEncounters')
      .mockReturnValueOnce('patient123')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('finished')
      .mockReturnValueOnce('ambulatory')
      .mockReturnValueOnce('checkup');

    const result = await executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/Encounter?patient=patient123'),
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('should get specific encounter successfully', async () => {
    const mockResponse = { resourceType: 'Encounter', id: 'enc123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEncounter')
      .mockReturnValueOnce('enc123');

    const result = await executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/Encounter/enc123'),
      })
    );
  });

  it('should create encounter successfully', async () => {
    const encounterData = { resourceType: 'Encounter', status: 'planned' };
    const mockResponse = { ...encounterData, id: 'new-enc123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEncounter')
      .mockReturnValueOnce(encounterData);

    const result = await executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/Encounter'),
        body: encounterData,
      })
    );
  });

  it('should update encounter successfully', async () => {
    const encounterData = { resourceType: 'Encounter', status: 'finished' };
    const mockResponse = { ...encounterData, id: 'enc123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateEncounter')
      .mockReturnValueOnce('enc123')
      .mockReturnValueOnce(encounterData);

    const result = await executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: expect.stringContaining('/Encounter/enc123'),
        body: encounterData,
      })
    );
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEncounter');

    const result = await executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEncounter');

    await expect(
      executeEncounterOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('AllergyIntolerance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should search allergies successfully', async () => {
    const mockResponse = {
      resourceType: 'Bundle',
      entry: [{ resource: { resourceType: 'AllergyIntolerance', id: '123' } }]
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('searchAllergies')
      .mockReturnValueOnce('Patient/123')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('medication');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should get specific allergy successfully', async () => {
    const mockResponse = { resourceType: 'AllergyIntolerance', id: '123' };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllergy')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should create allergy successfully', async () => {
    const mockResponse = { resourceType: 'AllergyIntolerance', id: '123' };
    const mockBody = { resourceType: 'AllergyIntolerance', patient: { reference: 'Patient/123' } };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAllergy')
      .mockReturnValueOnce(mockBody);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should update allergy successfully', async () => {
    const mockResponse = { resourceType: 'AllergyIntolerance', id: '123' };
    const mockBody = { resourceType: 'AllergyIntolerance', id: '123' };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateAllergy')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(mockBody);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchAllergies');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchAllergies');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeAllergyIntoleranceOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Procedure Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Epic FHIR R4 Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  test('searchProcedures should search for procedures successfully', async () => {
    const mockResponse = {
      resourceType: 'Bundle',
      entry: [
        {
          resource: {
            resourceType: 'Procedure',
            id: 'test-procedure-1',
            status: 'completed',
            subject: { reference: 'Patient/123' }
          }
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('searchProcedures')
      .mockReturnValueOnce('Patient/123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('completed')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeProcedureOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Procedure?patient=Patient%2F123&status=completed',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      },
      json: true
    });
  });

  test('getProcedure should retrieve specific procedure successfully', async () => {
    const mockResponse = {
      resourceType: 'Procedure',
      id: 'test-procedure-1',
      status: 'completed'
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProcedure')
      .mockReturnValueOnce('test-procedure-1');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeProcedureOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Procedure/test-procedure-1',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      },
      json: true
    });
  });

  test('createProcedure should create new procedure successfully', async () => {
    const procedureData = {
      resourceType: 'Procedure',
      status: 'completed',
      subject: { reference: 'Patient/123' }
    };

    const mockResponse = {
      ...procedureData,
      id: 'new-procedure-id'
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createProcedure')
      .mockReturnValueOnce(procedureData);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeProcedureOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Procedure',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      },
      body: procedureData,
      json: true
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProcedure')
      .mockReturnValueOnce('invalid-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Procedure not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeProcedureOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Procedure not found');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeProcedureOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});
});
