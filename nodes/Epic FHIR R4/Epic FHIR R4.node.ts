/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-epicfhirr4/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class EpicFHIRR4 implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Epic FHIR R4',
    name: 'epicfhirr4',
    icon: 'file:epicfhirr4.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Epic FHIR R4 API',
    defaults: {
      name: 'Epic FHIR R4',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'epicfhirr4Api',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Patient',
            value: 'patient',
          },
          {
            name: 'Observation',
            value: 'observation',
          },
          {
            name: 'Medication Request',
            value: 'medicationRequest',
          },
          {
            name: 'Medication',
            value: 'medication',
          },
          {
            name: 'Appointment',
            value: 'appointment',
          },
          {
            name: 'Practitioner',
            value: 'practitioner',
          },
          {
            name: 'Condition',
            value: 'condition',
          },
          {
            name: 'Encounter',
            value: 'encounter',
          },
          {
            name: 'AllergyIntolerance',
            value: 'allergyIntolerance',
          },
          {
            name: 'Procedure',
            value: 'procedure',
          }
        ],
        default: 'patient',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['patient'] } },
  options: [
    { name: 'Search Patients', value: 'searchPatients', description: 'Search for patients using demographic criteria', action: 'Search patients' },
    { name: 'Get Patient', value: 'getPatient', description: 'Get specific patient by ID', action: 'Get patient by ID' },
    { name: 'Get Patient Everything', value: 'getPatientEverything', description: 'Get comprehensive patient data including all related resources', action: 'Get patient everything' }
  ],
  default: 'searchPatients',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['observation'] } },
  options: [
    { name: 'Search Observations', value: 'searchObservations', description: 'Search for clinical observations', action: 'Search observations' },
    { name: 'Get Observation', value: 'getObservation', description: 'Get specific observation by ID', action: 'Get observation' },
    { name: 'Create Observation', value: 'createObservation', description: 'Create new observation', action: 'Create observation' },
    { name: 'Update Observation', value: 'updateObservation', description: 'Update existing observation', action: 'Update observation' }
  ],
  default: 'searchObservations',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
		},
	},
	options: [
		{
			name: 'Search Medication Requests',
			value: 'searchMedicationRequests',
			description: 'Search for medication requests using FHIR R4 parameters',
			action: 'Search medication requests',
		},
		{
			name: 'Get Medication Request',
			value: 'getMedicationRequest',
			description: 'Get a specific medication request by ID',
			action: 'Get a medication request',
		},
		{
			name: 'Create Medication Request',
			value: 'createMedicationRequest',
			description: 'Create a new medication request',
			action: 'Create a medication request',
		},
		{
			name: 'Update Medication Request',
			value: 'updateMedicationRequest',
			description: 'Update an existing medication request',
			action: 'Update a medication request',
		},
	],
	default: 'searchMedicationRequests',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['medication'],
		},
	},
	options: [
		{
			name: 'Search Medications',
			value: 'searchMedications',
			description: 'Search for medications using FHIR search parameters',
			action: 'Search medications',
		},
		{
			name: 'Get Medication',
			value: 'getMedication',
			description: 'Get a specific medication by ID',
			action: 'Get a medication',
		},
	],
	default: 'searchMedications',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['appointment'],
		},
	},
	options: [
		{
			name: 'Search Appointments',
			value: 'searchAppointments',
			description: 'Search for appointments using FHIR parameters',
			action: 'Search appointments',
		},
		{
			name: 'Get Appointment',
			value: 'getAppointment',
			description: 'Get a specific appointment by ID',
			action: 'Get an appointment',
		},
		{
			name: 'Create Appointment',
			value: 'createAppointment',
			description: 'Create a new appointment',
			action: 'Create an appointment',
		},
		{
			name: 'Update Appointment',
			value: 'updateAppointment',
			description: 'Update an existing appointment',
			action: 'Update an appointment',
		},
		{
			name: 'Patch Appointment',
			value: 'patchAppointment',
			description: 'Partially update an appointment',
			action: 'Patch an appointment',
		},
	],
	default: 'searchAppointments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['practitioner'] } },
  options: [
    { name: 'Search Practitioners', value: 'searchPractitioners', description: 'Search for practitioners', action: 'Search practitioners' },
    { name: 'Get Practitioner', value: 'getPractitioner', description: 'Get specific practitioner by ID', action: 'Get practitioner' }
  ],
  default: 'searchPractitioners',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['condition'],
		},
	},
	options: [
		{
			name: 'Search Conditions',
			value: 'searchConditions',
			description: 'Search for conditions based on patient, category, status, or code',
			action: 'Search conditions',
		},
		{
			name: 'Get Condition',
			value: 'getCondition',
			description: 'Get a specific condition by ID',
			action: 'Get a condition',
		},
		{
			name: 'Create Condition',
			value: 'createCondition',
			description: 'Create a new condition record',
			action: 'Create a condition',
		},
		{
			name: 'Update Condition',
			value: 'updateCondition',
			description: 'Update an existing condition record',
			action: 'Update a condition',
		},
	],
	default: 'searchConditions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['encounter'] } },
  options: [
    { name: 'Search Encounters', value: 'searchEncounters', description: 'Search for encounters', action: 'Search encounters' },
    { name: 'Get Encounter', value: 'getEncounter', description: 'Get specific encounter by ID', action: 'Get encounter' },
    { name: 'Create Encounter', value: 'createEncounter', description: 'Create new encounter', action: 'Create encounter' },
    { name: 'Update Encounter', value: 'updateEncounter', description: 'Update existing encounter', action: 'Update encounter' },
  ],
  default: 'searchEncounters',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['allergyIntolerance'] } },
  options: [
    { name: 'Search Allergies', value: 'searchAllergies', description: 'Search for allergies and intolerances', action: 'Search allergies' },
    { name: 'Get Allergy', value: 'getAllergy', description: 'Get specific allergy by ID', action: 'Get allergy' },
    { name: 'Create Allergy', value: 'createAllergy', description: 'Create new allergy intolerance', action: 'Create allergy' },
    { name: 'Update Allergy', value: 'updateAllergy', description: 'Update existing allergy intolerance', action: 'Update allergy' }
  ],
  default: 'searchAllergies',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['procedure'] } },
  options: [
    { name: 'Search Procedures', value: 'searchProcedures', description: 'Search for procedures', action: 'Search procedures' },
    { name: 'Get Procedure', value: 'getProcedure', description: 'Get specific procedure by ID', action: 'Get a procedure' },
    { name: 'Create Procedure', value: 'createProcedure', description: 'Create new procedure', action: 'Create a procedure' },
    { name: 'Update Procedure', value: 'updateProcedure', description: 'Update existing procedure', action: 'Update a procedure' }
  ],
  default: 'searchProcedures',
},
{
  displayName: 'Patient Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Patient name (can be partial)',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['searchPatients']
    }
  }
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  default: '',
  description: 'Patient identifier (MRN, SSN, etc.)',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['searchPatients']
    }
  }
},
{
  displayName: 'Birth Date',
  name: 'birthdate',
  type: 'dateTime',
  default: '',
  description: 'Patient birth date (YYYY-MM-DD format)',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['searchPatients']
    }
  }
},
{
  displayName: 'Family Name',
  name: 'family',
  type: 'string',
  default: '',
  description: 'Patient family (last) name',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['searchPatients']
    }
  }
},
{
  displayName: 'Given Name',
  name: 'given',
  type: 'string',
  default: '',
  description: 'Patient given (first) name',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['searchPatients']
    }
  }
},
{
  displayName: 'Patient ID',
  name: 'patientId',
  type: 'string',
  required: true,
  default: '',
  description: 'The FHIR ID of the patient',
  displayOptions: {
    show: {
      resource: ['patient'],
      operation: ['getPatient', 'getPatientEverything']
    }
  }
},
{
  displayName: 'Patient ID',
  name: 'patient',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['observation'], operation: ['searchObservations'] } },
  default: '',
  description: 'The patient identifier to search observations for',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['observation'], operation: ['searchObservations'] } },
  default: '',
  description: 'Classification of type of observation (e.g., vital-signs, laboratory)',
},
{
  displayName: 'Code',
  name: 'code',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['observation'], operation: ['searchObservations'] } },
  default: '',
  description: 'The code of the observation type',
},
{
  displayName: 'Date',
  name: 'date',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['observation'], operation: ['searchObservations'] } },
  default: '',
  description: 'Obtained date/time. If the obtained element is a period, a date that falls in the period',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['observation'], operation: ['searchObservations'] } },
  options: [
    { name: 'Registered', value: 'registered' },
    { name: 'Preliminary', value: 'preliminary' },
    { name: 'Final', value: 'final' },
    { name: 'Amended', value: 'amended' },
    { name: 'Corrected', value: 'corrected' },
    { name: 'Cancelled', value: 'cancelled' },
    { name: 'Entered in Error', value: 'entered-in-error' },
    { name: 'Unknown', value: 'unknown' }
  ],
  default: '',
  description: 'The status of the observation',
},
{
  displayName: 'Observation ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['observation'], operation: ['getObservation'] } },
  default: '',
  description: 'The unique identifier for the observation',
},
{
  displayName: 'Observation Data',
  name: 'body',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['observation'], operation: ['createObservation'] } },
  default: '{\n  "resourceType": "Observation",\n  "status": "final",\n  "category": [{\n    "coding": [{\n      "system": "http://terminology.hl7.org/CodeSystem/observation-category",\n      "code": "vital-signs"\n    }]\n  }],\n  "code": {\n    "coding": [{\n      "system": "http://loinc.org",\n      "code": "8480-6",\n      "display": "Systolic blood pressure"\n    }]\n  },\n  "subject": {\n    "reference": "Patient/123"\n  }\n}',
  description: 'The FHIR R4 Observation resource data',
},
{
  displayName: 'Observation ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['observation'], operation: ['updateObservation'] } },
  default: '',
  description: 'The unique identifier for the observation to update',
},
{
  displayName: 'Observation Data',
  name: 'body',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['observation'], operation: ['updateObservation'] } },
  default: '{\n  "resourceType": "Observation",\n  "id": "",\n  "status": "final",\n  "category": [{\n    "coding": [{\n      "system": "http://terminology.hl7.org/CodeSystem/observation-category",\n      "code": "vital-signs"\n    }]\n  }],\n  "code": {\n    "coding": [{\n      "system": "http://loinc.org",\n      "code": "8480-6",\n      "display": "Systolic blood pressure"\n    }]\n  },\n  "subject": {\n    "reference": "Patient/123"\n  }\n}',
  description: 'The FHIR R4 Observation resource data to update',
},
{
	displayName: 'Patient ID',
	name: 'patient',
	type: 'string',
	default: '',
	description: 'The patient for whom the medication request is intended',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['searchMedicationRequests'],
		},
	},
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'On-Hold', value: 'on-hold' },
		{ name: 'Cancelled', value: 'cancelled' },
		{ name: 'Completed', value: 'completed' },
		{ name: 'Entered in Error', value: 'entered-in-error' },
		{ name: 'Stopped', value: 'stopped' },
		{ name: 'Draft', value: 'draft' },
		{ name: 'Unknown', value: 'unknown' },
	],
	default: '',
	description: 'Status of the medication request',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['searchMedicationRequests'],
		},
	},
	required: false,
},
{
	displayName: 'Intent',
	name: 'intent',
	type: 'options',
	options: [
		{ name: 'Proposal', value: 'proposal' },
		{ name: 'Plan', value: 'plan' },
		{ name: 'Order', value: 'order' },
		{ name: 'Original Order', value: 'original-order' },
		{ name: 'Reflex Order', value: 'reflex-order' },
		{ name: 'Filler Order', value: 'filler-order' },
		{ name: 'Instance Order', value: 'instance-order' },
		{ name: 'Option', value: 'option' },
	],
	default: '',
	description: 'Intent of the medication request',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['searchMedicationRequests'],
		},
	},
	required: false,
},
{
	displayName: 'Authored On',
	name: 'authoredon',
	type: 'dateTime',
	default: '',
	description: 'Date when the medication request was authored',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['searchMedicationRequests'],
		},
	},
	required: false,
},
{
	displayName: 'Medication Request ID',
	name: 'id',
	type: 'string',
	default: '',
	description: 'The ID of the medication request to retrieve',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['getMedicationRequest'],
		},
	},
	required: true,
},
{
	displayName: 'FHIR Resource Body',
	name: 'body',
	type: 'json',
	default: '{}',
	description: 'The FHIR R4 MedicationRequest resource in JSON format',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['createMedicationRequest'],
		},
	},
	required: true,
},
{
	displayName: 'Medication Request ID',
	name: 'id',
	type: 'string',
	default: '',
	description: 'The ID of the medication request to update',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['updateMedicationRequest'],
		},
	},
	required: true,
},
{
	displayName: 'FHIR Resource Body',
	name: 'body',
	type: 'json',
	default: '{}',
	description: 'The updated FHIR R4 MedicationRequest resource in JSON format',
	displayOptions: {
		show: {
			resource: ['medicationRequest'],
			operation: ['updateMedicationRequest'],
		},
	},
	required: true,
},
{
	displayName: 'Code',
	name: 'code',
	type: 'string',
	default: '',
	description: 'A code that identifies this medication',
	displayOptions: {
		show: {
			resource: ['medication'],
			operation: ['searchMedications'],
		},
	},
},
{
	displayName: 'Form',
	name: 'form',
	type: 'string',
	default: '',
	description: 'The form of the medication (e.g., tablet, capsule)',
	displayOptions: {
		show: {
			resource: ['medication'],
			operation: ['searchMedications'],
		},
	},
},
{
	displayName: 'Ingredient',
	name: 'ingredient',
	type: 'string',
	default: '',
	description: 'An ingredient of the medication',
	displayOptions: {
		show: {
			resource: ['medication'],
			operation: ['searchMedications'],
		},
	},
},
{
	displayName: 'Medication ID',
	name: 'medicationId',
	type: 'string',
	default: '',
	required: true,
	description: 'The ID of the medication to retrieve',
	displayOptions: {
		show: {
			resource: ['medication'],
			operation: ['getMedication'],
		},
	},
},
{
	displayName: 'Patient ID',
	name: 'patient',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['searchAppointments'],
		},
	},
	default: '',
	description: 'Patient identifier to search appointments for',
},
{
	displayName: 'Practitioner ID',
	name: 'practitioner',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['searchAppointments'],
		},
	},
	default: '',
	description: 'Practitioner identifier to search appointments for',
},
{
	displayName: 'Date',
	name: 'date',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['searchAppointments'],
		},
	},
	default: '',
	description: 'Appointment date (YYYY-MM-DD format)',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['searchAppointments'],
		},
	},
	options: [
		{
			name: 'Proposed',
			value: 'proposed',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Booked',
			value: 'booked',
		},
		{
			name: 'Arrived',
			value: 'arrived',
		},
		{
			name: 'Fulfilled',
			value: 'fulfilled',
		},
		{
			name: 'Cancelled',
			value: 'cancelled',
		},
		{
			name: 'No Show',
			value: 'noshow',
		},
		{
			name: 'Entered in Error',
			value: 'entered-in-error',
		},
		{
			name: 'Checked In',
			value: 'checked-in',
		},
		{
			name: 'Waitlist',
			value: 'waitlist',
		},
	],
	default: '',
	description: 'Appointment status',
},
{
	displayName: 'Appointment ID',
	name: 'appointmentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['getAppointment', 'updateAppointment', 'patchAppointment'],
		},
	},
	default: '',
	description: 'The ID of the appointment',
},
{
	displayName: 'Appointment Data',
	name: 'appointmentData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['appointment'],
			operation: ['createAppointment', 'updateAppointment', 'patchAppointment'],
		},
	},
	default: '{}',
	description: 'FHIR R4 Appointment resource data',
},
{
  displayName: 'Practitioner ID',
  name: 'practitionerId',
  type: 'string',
  required: true,
  default: '',
  description: 'The unique identifier of the practitioner',
  displayOptions: {
    show: {
      resource: ['practitioner'],
      operation: ['getPractitioner'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'The name of the practitioner (any part)',
  displayOptions: {
    show: {
      resource: ['practitioner'],
      operation: ['searchPractitioners'],
    },
  },
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  default: '',
  description: 'Business identifier for the practitioner',
  displayOptions: {
    show: {
      resource: ['practitioner'],
      operation: ['searchPractitioners'],
    },
  },
},
{
  displayName: 'Family Name',
  name: 'family',
  type: 'string',
  default: '',
  description: 'Family name (surname) of the practitioner',
  displayOptions: {
    show: {
      resource: ['practitioner'],
      operation: ['searchPractitioners'],
    },
  },
},
{
  displayName: 'Given Name',
  name: 'given',
  type: 'string',
  default: '',
  description: 'Given name (first name) of the practitioner',
  displayOptions: {
    show: {
      resource: ['practitioner'],
      operation: ['searchPractitioners'],
    },
  },
},
{
	displayName: 'Patient ID',
	name: 'patient',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['searchConditions'],
		},
	},
	default: '',
	description: 'The patient whose conditions are being searched',
	placeholder: 'eKRB5S74vdkWNVLMHNpKNlQ3',
},
{
	displayName: 'Category',
	name: 'category',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['searchConditions'],
		},
	},
	options: [
		{
			name: 'Problem List Item',
			value: 'problem-list-item',
		},
		{
			name: 'Encounter Diagnosis',
			value: 'encounter-diagnosis',
		},
	],
	default: '',
	description: 'The category of the condition',
},
{
	displayName: 'Clinical Status',
	name: 'clinicalStatus',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['searchConditions'],
		},
	},
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'Resolved',
			value: 'resolved',
		},
		{
			name: 'Remission',
			value: 'remission',
		},
	],
	default: '',
	description: 'The clinical status of the condition',
},
{
	displayName: 'Condition Code',
	name: 'code',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['searchConditions'],
		},
	},
	default: '',
	description: 'The condition code (e.g., ICD-10, SNOMED CT)',
	placeholder: 'I10',
},
{
	displayName: 'Condition ID',
	name: 'conditionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['getCondition', 'updateCondition'],
		},
	},
	default: '',
	description: 'The ID of the condition to retrieve or update',
	placeholder: 'TBcpqEXeNa3UmPqNEVfvhMgzB',
},
{
	displayName: 'Condition Data',
	name: 'conditionData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['condition'],
			operation: ['createCondition', 'updateCondition'],
		},
	},
	default: '{\n  "resourceType": "Condition",\n  "subject": {\n    "reference": "Patient/eKRB5S74vdkWNVLMHNpKNlQ3"\n  },\n  "code": {\n    "coding": [{\n      "system": "http://hl7.org/fhir/sid/icd-10-cm",\n      "code": "I10",\n      "display": "Essential hypertension"\n    }]\n  },\n  "clinicalStatus": {\n    "coding": [{\n      "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",\n      "code": "active"\n    }]\n  }\n}',
	description: 'The FHIR Condition resource data in JSON format',
},
{
  displayName: 'Patient ID',
  name: 'patient',
  type: 'string',
  displayOptions: { show: { resource: ['encounter'], operation: ['searchEncounters'] } },
  default: '',
  description: 'The patient ID to filter encounters',
},
{
  displayName: 'Date',
  name: 'date',
  type: 'string',
  displayOptions: { show: { resource: ['encounter'], operation: ['searchEncounters'] } },
  default: '',
  description: 'Date range for encounters (YYYY-MM-DD or date range)',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['encounter'], operation: ['searchEncounters'] } },
  options: [
    { name: 'Planned', value: 'planned' },
    { name: 'Arrived', value: 'arrived' },
    { name: 'Triaged', value: 'triaged' },
    { name: 'In Progress', value: 'in-progress' },
    { name: 'On Leave', value: 'onleave' },
    { name: 'Finished', value: 'finished' },
    { name: 'Cancelled', value: 'cancelled' },
    { name: 'Entered in Error', value: 'entered-in-error' },
    { name: 'Unknown', value: 'unknown' },
  ],
  default: '',
  description: 'Status of the encounter',
},
{
  displayName: 'Class',
  name: 'class',
  type: 'string',
  displayOptions: { show: { resource: ['encounter'], operation: ['searchEncounters'] } },
  default: '',
  description: 'Classification of patient encounter',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  displayOptions: { show: { resource: ['encounter'], operation: ['searchEncounters'] } },
  default: '',
  description: 'Specific type of encounter',
},
{
  displayName: 'Encounter ID',
  name: 'encounterId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['encounter'], operation: ['getEncounter', 'updateEncounter'] } },
  default: '',
  description: 'The ID of the encounter',
},
{
  displayName: 'Encounter Data',
  name: 'body',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['encounter'], operation: ['createEncounter', 'updateEncounter'] } },
  default: '{}',
  description: 'The FHIR R4 encounter resource data',
},
{
  displayName: 'Patient ID',
  name: 'patient',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['searchAllergies'] } },
  default: '',
  description: 'The patient whose allergies are to be searched',
},
{
  displayName: 'Clinical Status',
  name: 'clinicalStatus',
  type: 'options',
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['searchAllergies'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Resolved', value: 'resolved' }
  ],
  default: 'active',
  description: 'Clinical status of the allergy or intolerance',
},
{
  displayName: 'Verification Status',
  name: 'verificationStatus',
  type: 'options',
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['searchAllergies'] } },
  options: [
    { name: 'Unconfirmed', value: 'unconfirmed' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Refuted', value: 'refuted' },
    { name: 'Entered in Error', value: 'entered-in-error' }
  ],
  default: 'confirmed',
  description: 'Assertion about certainty associated with the propensity',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['searchAllergies'] } },
  options: [
    { name: 'Food', value: 'food' },
    { name: 'Medication', value: 'medication' },
    { name: 'Environment', value: 'environment' },
    { name: 'Biologic', value: 'biologic' }
  ],
  default: 'medication',
  description: 'Category of the identified substance',
},
{
  displayName: 'Allergy ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['getAllergy', 'updateAllergy'] } },
  default: '',
  description: 'The ID of the allergy intolerance resource',
},
{
  displayName: 'Allergy Data',
  name: 'body',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['allergyIntolerance'], operation: ['createAllergy', 'updateAllergy'] } },
  default: '{\n  "resourceType": "AllergyIntolerance",\n  "clinicalStatus": {\n    "coding": [{\n      "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",\n      "code": "active"\n    }]\n  },\n  "verificationStatus": {\n    "coding": [{\n      "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",\n      "code": "confirmed"\n    }]\n  },\n  "category": ["medication"],\n  "patient": {\n    "reference": "Patient/123"\n  }\n}',
  description: 'The FHIR AllergyIntolerance resource data',
},
{
  displayName: 'Patient ID',
  name: 'patient',
  type: 'string',
  required: false,
  default: '',
  description: 'The patient ID to search procedures for',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['searchProcedures']
    }
  }
},
{
  displayName: 'Date',
  name: 'date',
  type: 'string',
  required: false,
  default: '',
  description: 'The procedure date (YYYY-MM-DD or date range)',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['searchProcedures']
    }
  }
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  default: '',
  options: [
    { name: 'All', value: '' },
    { name: 'Preparation', value: 'preparation' },
    { name: 'In Progress', value: 'in-progress' },
    { name: 'Not Done', value: 'not-done' },
    { name: 'On Hold', value: 'on-hold' },
    { name: 'Stopped', value: 'stopped' },
    { name: 'Completed', value: 'completed' },
    { name: 'Entered in Error', value: 'entered-in-error' },
    { name: 'Unknown', value: 'unknown' }
  ],
  description: 'The status of the procedure',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['searchProcedures']
    }
  }
},
{
  displayName: 'Code',
  name: 'code',
  type: 'string',
  required: false,
  default: '',
  description: 'The procedure code (CPT, SNOMED, etc.)',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['searchProcedures']
    }
  }
},
{
  displayName: 'Procedure ID',
  name: 'id',
  type: 'string',
  required: true,
  default: '',
  description: 'The unique identifier of the procedure',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['getProcedure', 'updateProcedure']
    }
  }
},
{
  displayName: 'Procedure Data',
  name: 'body',
  type: 'json',
  required: true,
  default: '{}',
  description: 'The FHIR Procedure resource data',
  displayOptions: {
    show: {
      resource: ['procedure'],
      operation: ['createProcedure', 'updateProcedure']
    }
  }
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'patient':
        return [await executePatientOperations.call(this, items)];
      case 'observation':
        return [await executeObservationOperations.call(this, items)];
      case 'medicationRequest':
        return [await executeMedicationRequestOperations.call(this, items)];
      case 'medication':
        return [await executeMedicationOperations.call(this, items)];
      case 'appointment':
        return [await executeAppointmentOperations.call(this, items)];
      case 'practitioner':
        return [await executePractitionerOperations.call(this, items)];
      case 'condition':
        return [await executeConditionOperations.call(this, items)];
      case 'encounter':
        return [await executeEncounterOperations.call(this, items)];
      case 'allergyIntolerance':
        return [await executeAllergyIntoleranceOperations.call(this, items)];
      case 'procedure':
        return [await executeProcedureOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executePatientOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'searchPatients': {
          const searchParams = new URLSearchParams();
          
          const name = this.getNodeParameter('name', i, '') as string;
          const identifier = this.getNodeParameter('identifier', i, '') as string;
          const birthdate = this.getNodeParameter('birthdate', i, '') as string;
          const family = this.getNodeParameter('family', i, '') as string;
          const given = this.getNodeParameter('given', i, '') as string;

          if (name) searchParams.append('name', name);
          if (identifier) searchParams.append('identifier', identifier);
          if (birthdate) searchParams.append('birthdate', birthdate);
          if (family) searchParams.append('family', family);
          if (given) searchParams.append('given', given);

          const queryString = searchParams.toString();
          const url = `${credentials.baseUrl}/Patient${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPatient': {
          const patientId = this.getNodeParameter('patientId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Patient/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPatientEverything': {
          const patientId = this.getNodeParameter('patientId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Patient/${patientId}/$everything`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeObservationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchObservations': {
          const queryParams = new URLSearchParams();
          
          const patient = this.getNodeParameter('patient', i) as string;
          const category = this.getNodeParameter('category', i) as string;
          const code = this.getNodeParameter('code', i) as string;
          const date = this.getNodeParameter('date', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          if (patient) queryParams.append('patient', patient);
          if (category) queryParams.append('category', category);
          if (code) queryParams.append('code', code);
          if (date) queryParams.append('date', date);
          if (status) queryParams.append('status', status);

          const queryString = queryParams.toString();
          const url = `${credentials.baseUrl}/Observation${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getObservation': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Observation/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createObservation': {
          const body = this.getNodeParameter('body', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/Observation`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            body: body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateObservation': {
          const id = this.getNodeParameter('id', i) as string;
          const body = this.getNodeParameter('body', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/Observation/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            body: body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMedicationRequestOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('epicfhirr4Api') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'searchMedicationRequests': {
					const patient = this.getNodeParameter('patient', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const intent = this.getNodeParameter('intent', i) as string;
					const authoredon = this.getNodeParameter('authoredon', i) as string;

					const queryParams = new URLSearchParams();
					if (patient) queryParams.append('patient', patient);
					if (status) queryParams.append('status', status);
					if (intent) queryParams.append('intent', intent);
					if (authoredon) queryParams.append('authoredon', authoredon);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/MedicationRequest${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMedicationRequest': {
					const id = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/MedicationRequest/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createMedicationRequest': {
					const body = this.getNodeParameter('body', i) as object;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/MedicationRequest`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateMedicationRequest': {
					const id = this.getNodeParameter('id', i) as string;
					const body = this.getNodeParameter('body', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/MedicationRequest/${id}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMedicationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('epicfhirr4Api') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'searchMedications': {
					const code = this.getNodeParameter('code', i) as string;
					const form = this.getNodeParameter('form', i) as string;
					const ingredient = this.getNodeParameter('ingredient', i) as string;

					const searchParams = new URLSearchParams();
					if (code) searchParams.append('code', code);
					if (form) searchParams.append('form', form);
					if (ingredient) searchParams.append('ingredient', ingredient);

					const url = `${credentials.baseUrl}/Medication${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMedication': {
					const medicationId = this.getNodeParameter('medicationId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/Medication/${medicationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAppointmentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('epicfhirr4Api') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'searchAppointments': {
					const queryParams: any = {};
					
					const patient = this.getNodeParameter('patient', i) as string;
					const practitioner = this.getNodeParameter('practitioner', i) as string;
					const date = this.getNodeParameter('date', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					if (patient) queryParams.patient = patient;
					if (practitioner) queryParams.practitioner = practitioner;
					if (date) queryParams.date = date;
					if (status) queryParams.status = status;

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/Appointment${queryString ? '?' + queryString : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAppointment': {
					const appointmentId = this.getNodeParameter('appointmentId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/Appointment/${appointmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createAppointment': {
					const appointmentData = this.getNodeParameter('appointmentData', i) as object;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/Appointment`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: appointmentData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateAppointment': {
					const appointmentId = this.getNodeParameter('appointmentId', i) as string;
					const appointmentData = this.getNodeParameter('appointmentData', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/Appointment/${appointmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: appointmentData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'patchAppointment': {
					const appointmentId = this.getNodeParameter('appointmentId', i) as string;
					const appointmentData = this.getNodeParameter('appointmentData', i) as object;

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/Appointment/${appointmentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/json-patch+json',
						},
						body: appointmentData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePractitionerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchPractitioners': {
          const queryParams: string[] = [];
          
          const name = this.getNodeParameter('name', i, '') as string;
          if (name) {
            queryParams.push(`name=${encodeURIComponent(name)}`);
          }

          const identifier = this.getNodeParameter('identifier', i, '') as string;
          if (identifier) {
            queryParams.push(`identifier=${encodeURIComponent(identifier)}`);
          }

          const family = this.getNodeParameter('family', i, '') as string;
          if (family) {
            queryParams.push(`family=${encodeURIComponent(family)}`);
          }

          const given = this.getNodeParameter('given', i, '') as string;
          if (given) {
            queryParams.push(`given=${encodeURIComponent(given)}`);
          }

          const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
          const url = `${credentials.baseUrl}/Practitioner${queryString}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPractitioner': {
          const practitionerId = this.getNodeParameter('practitionerId', i) as string;
          const url = `${credentials.baseUrl}/Practitioner/${practitionerId}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeConditionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('epicfhirr4Api') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseUrl = credentials.baseUrl || 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

			switch (operation) {
				case 'searchConditions': {
					const searchParams: string[] = [];
					
					const patient = this.getNodeParameter('patient', i) as string;
					const category = this.getNodeParameter('category', i) as string;
					const clinicalStatus = this.getNodeParameter('clinicalStatus', i) as string;
					const code = this.getNodeParameter('code', i) as string;

					if (patient) searchParams.push(`patient=${encodeURIComponent(patient)}`);
					if (category) searchParams.push(`category=${encodeURIComponent(category)}`);
					if (clinicalStatus) searchParams.push(`clinical-status=${encodeURIComponent(clinicalStatus)}`);
					if (code) searchParams.push(`code=${encodeURIComponent(code)}`);

					const queryString = searchParams.length > 0 ? `?${searchParams.join('&')}` : '';
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/Condition${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCondition': {
					const conditionId = this.getNodeParameter('conditionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/Condition/${conditionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createCondition': {
					const conditionData = this.getNodeParameter('conditionData', i) as object;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/Condition`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: conditionData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateCondition': {
					const conditionId = this.getNodeParameter('conditionId', i) as string;
					const conditionData = this.getNodeParameter('conditionData', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${baseUrl}/Condition/${conditionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/fhir+json',
							'Content-Type': 'application/fhir+json',
						},
						body: conditionData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEncounterOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchEncounters': {
          const params: any = {};
          
          const patient = this.getNodeParameter('patient', i) as string;
          const date = this.getNodeParameter('date', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const encounterClass = this.getNodeParameter('class', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          if (patient) params.patient = patient;
          if (date) params.date = date;
          if (status) params.status = status;
          if (encounterClass) params.class = encounterClass;
          if (type) params.type = type;

          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/Encounter${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEncounter': {
          const encounterId = this.getNodeParameter('encounterId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Encounter/${encounterId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEncounter': {
          const body = this.getNodeParameter('body', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/Encounter`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEncounter': {
          const encounterId = this.getNodeParameter('encounterId', i) as string;
          const body = this.getNodeParameter('body', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/Encounter/${encounterId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAllergyIntoleranceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchAllergies': {
          const patient = this.getNodeParameter('patient', i) as string;
          const clinicalStatus = this.getNodeParameter('clinicalStatus', i, '') as string;
          const verificationStatus = this.getNodeParameter('verificationStatus', i, '') as string;
          const category = this.getNodeParameter('category', i, '') as string;

          const searchParams = new URLSearchParams();
          searchParams.append('patient', patient);
          if (clinicalStatus) searchParams.append('clinical-status', clinicalStatus);
          if (verificationStatus) searchParams.append('verification-status', verificationStatus);
          if (category) searchParams.append('category', category);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/AllergyIntolerance?${searchParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllergy': {
          const allergyId = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/AllergyIntolerance/${allergyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAllergy': {
          const body = this.getNodeParameter('body', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/AllergyIntolerance`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            body: typeof body === 'string' ? JSON.parse(body) : body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAllergy': {
          const allergyId = this.getNodeParameter('id', i) as string;
          const body = this.getNodeParameter('body', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/AllergyIntolerance/${allergyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json',
            },
            body: typeof body === 'string' ? JSON.parse(body) : body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProcedureOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('epicfhirr4Api') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'searchProcedures': {
          const patient = this.getNodeParameter('patient', i) as string;
          const date = this.getNodeParameter('date', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const code = this.getNodeParameter('code', i) as string;

          const searchParams = new URLSearchParams();
          if (patient) searchParams.append('patient', patient);
          if (date) searchParams.append('date', date);
          if (status) searchParams.append('status', status);
          if (code) searchParams.append('code', code);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Procedure?${searchParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProcedure': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/Procedure/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createProcedure': {
          const body = this.getNodeParameter('body', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/Procedure`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            body: typeof body === 'string' ? JSON.parse(body) : body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateProcedure': {
          const id = this.getNodeParameter('id', i) as string;
          const body = this.getNodeParameter('body', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/Procedure/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/fhir+json',
              'Content-Type': 'application/fhir+json'
            },
            body: typeof body === 'string' ? JSON.parse(body) : body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
