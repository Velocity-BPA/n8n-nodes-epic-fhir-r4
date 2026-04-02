import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EpicFHIRR4Api implements ICredentialType {
	name = 'epicFHIRR4Api';
	displayName = 'Epic FHIR R4 API';
	documentationUrl = 'https://fhir.epic.com/Documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'options',
			options: [
				{
					name: 'Authorization Code',
					value: 'authorizationCode',
				},
				{
					name: 'Client Credentials',
					value: 'clientCredentials',
				},
			],
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					grantType: ['clientCredentials'],
				},
			},
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'patient/*.read',
			placeholder: 'patient/*.read user/*.read system/*.read',
			description: 'SMART on FHIR scopes (space-separated)',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
			required: true,
		},
	];
}