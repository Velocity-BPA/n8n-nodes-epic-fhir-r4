# n8n-nodes-epic-fhir-r4

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Epic's FHIR R4 API, enabling healthcare workflows to interact with 10 essential clinical resources. It offers comprehensive CRUD operations for patient data, observations, medications, appointments, and other critical healthcare information with robust error handling and Epic-specific optimizations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![FHIR R4](https://img.shields.io/badge/FHIR-R4-green)
![Epic](https://img.shields.io/badge/Epic-Healthcare-orange)
![Healthcare](https://img.shields.io/badge/Healthcare-Interoperability-red)

## Features

- **Complete FHIR R4 Support** - Full implementation of Epic's FHIR R4 specification with 10 core clinical resources
- **Patient Management** - Create, read, update, and search patient demographics and identifiers
- **Clinical Data Access** - Retrieve observations, conditions, procedures, and allergy information
- **Medication Workflows** - Manage medication requests and medication information
- **Appointment Integration** - Schedule and manage healthcare appointments with practitioners
- **Provider Directory** - Access practitioner information and healthcare provider details
- **Encounter Tracking** - Monitor patient encounters and healthcare visits
- **Epic-Optimized** - Built specifically for Epic healthcare systems with proper error handling
- **Secure Authentication** - API key-based authentication with Epic's security standards

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-epic-fhir-r4`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-epic-fhir-r4
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-epic-fhir-r4.git
cd n8n-nodes-epic-fhir-r4
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-epic-fhir-r4
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Epic FHIR API key for authentication | Yes |
| Base URL | Epic FHIR server base URL (e.g., https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4) | Yes |
| Client ID | Epic application client identifier | Yes |
| Environment | Epic environment (sandbox/production) | No |

## Resources & Operations

### 1. Patient

| Operation | Description |
|-----------|-------------|
| Create | Create a new patient record |
| Get | Retrieve patient by ID |
| Update | Update existing patient information |
| Search | Search patients by name, identifier, or demographics |
| Delete | Remove patient record |

### 2. Observation

| Operation | Description |
|-----------|-------------|
| Create | Record a new clinical observation |
| Get | Retrieve observation by ID |
| Update | Update existing observation |
| Search | Search observations by patient, date, or code |
| Delete | Remove observation record |

### 3. Medication Request

| Operation | Description |
|-----------|-------------|
| Create | Create a new medication prescription request |
| Get | Retrieve medication request by ID |
| Update | Update existing medication request |
| Search | Search medication requests by patient or status |
| Cancel | Cancel medication request |

### 4. Medication

| Operation | Description |
|-----------|-------------|
| Get | Retrieve medication information by ID |
| Search | Search medications by name or code |
| List | Get all available medications |

### 5. Appointment

| Operation | Description |
|-----------|-------------|
| Create | Schedule a new appointment |
| Get | Retrieve appointment details by ID |
| Update | Update appointment information |
| Search | Search appointments by patient, date, or provider |
| Cancel | Cancel existing appointment |

### 6. Practitioner

| Operation | Description |
|-----------|-------------|
| Get | Retrieve practitioner information by ID |
| Search | Search practitioners by name or specialty |
| List | Get all available practitioners |

### 7. Condition

| Operation | Description |
|-----------|-------------|
| Create | Record a new medical condition |
| Get | Retrieve condition by ID |
| Update | Update existing condition |
| Search | Search conditions by patient or code |
| Delete | Remove condition record |

### 8. Encounter

| Operation | Description |
|-----------|-------------|
| Create | Create a new healthcare encounter |
| Get | Retrieve encounter by ID |
| Update | Update encounter information |
| Search | Search encounters by patient or date |
| Close | Mark encounter as completed |

### 9. AllergyIntolerance

| Operation | Description |
|-----------|-------------|
| Create | Record a new allergy or intolerance |
| Get | Retrieve allergy information by ID |
| Update | Update existing allergy record |
| Search | Search allergies by patient |
| Delete | Remove allergy record |

### 10. Procedure

| Operation | Description |
|-----------|-------------|
| Create | Record a new medical procedure |
| Get | Retrieve procedure by ID |
| Update | Update procedure information |
| Search | Search procedures by patient or code |
| Delete | Remove procedure record |

## Usage Examples

```javascript
// Search for patients by name
{
  "resource": "Patient",
  "operation": "Search",
  "name": "John Smith",
  "limit": 10
}
```

```javascript
// Create a new observation for vital signs
{
  "resource": "Observation",
  "operation": "Create",
  "patientId": "patient-123",
  "code": "85354-9",
  "display": "Blood pressure",
  "valueQuantity": {
    "value": 120,
    "unit": "mmHg"
  },
  "effectiveDateTime": "2024-01-15T10:30:00Z"
}
```

```javascript
// Schedule an appointment
{
  "resource": "Appointment",
  "operation": "Create",
  "patientId": "patient-123",
  "practitionerId": "practitioner-456",
  "start": "2024-02-01T14:00:00Z",
  "end": "2024-02-01T15:00:00Z",
  "serviceType": "General Medicine"
}
```

```javascript
// Search medication requests for a patient
{
  "resource": "MedicationRequest",
  "operation": "Search",
  "patient": "patient-123",
  "status": "active",
  "date": "2024-01-01"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or expired token | Verify API credentials and refresh if necessary |
| 403 Forbidden | Insufficient permissions for resource | Check Epic application permissions and scopes |
| 404 Not Found | Resource ID does not exist | Verify resource ID and check if resource was deleted |
| 422 Unprocessable Entity | Invalid FHIR resource data | Validate resource structure against FHIR R4 specification |
| 429 Rate Limited | Too many API requests | Implement retry logic with exponential backoff |
| 500 Internal Server Error | Epic server error | Check Epic system status and retry request |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-epic-fhir-r4/issues)
- **Epic FHIR R4 Documentation**: [fhir.epic.com](https://fhir.epic.com/)
- **HL7 FHIR Specification**: [hl7.org/fhir/R4](https://hl7.org/fhir/R4/)