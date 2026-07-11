# SevisPass Integration

## Section E - RP Data to be added to Trust Registry
| **JSON Key**      | **Description**                                            | **Example Value (Generic)**       |
| ----------------- | ---------------------------------------------------------- | --------------------------------- |
| organization_name | The official name of the institution displayed in branding | [INSTITUTION_NAME]                |
| workflow_name     | The primary title shown on the welcome screen and widget   | [WFL_INSTITUTION_NAME]            |
| credential_type   | Technical ID for the credential to be issued or used       | [PROJECT_ID][CREDENTIAL_NAME]     |
| tags              | Labels used to categorize the workflow purpose             | ["onboarding", "service_request"] |
| organization_logo | Public URL for the institution's logo                      | https://[URL]/logo.png            |
| offer_title       | Headline for promotional offer within the workflow         | Request Digital [ID_NAME]         |
| offer_description | The sub-text explaining the benefit of the offer           | Apply for your digital credential now. |
| disclosedFields   | List of specific attributes required from the User's ID    | ["name", "dob", "photo"]               |



## Section F - Data required for your services
| **Field Name** | **Type** | **Required** | **Description**      |
| -------------- | -------- | ------------ | -------------------- |
| title          | string   | No           | Mr, Mrs, etc.        |
| nationality    | string   | No           | Nationality          |
| firstName      | string   | Yes          | First name           |
| lastName       | string   | Yes          | Last name            |
| phone          | string   | No           | Phone number         |
| email          | string   | No           | Email                |
| gender         | string   | No           | Gender               |
| dob            | string   | No           | Date of birth        |
| maritalStatus  | string   | No           | Marital status       |
| photo          | string   | Yes          | Photo (base64)       |
| address        | string   | No           | Residential address  |
| province       | string   | No           | Province             |
| district       | string   | No           | District             |
| documentNumber | string   | Yes          | Document/ID number   |
| issueDate      | string   | No           | Document issue date  |
| expiryDate     | string   | No           | Document expiry date |
| tier           | number   | Yes          | Document tier        |


## Test outbound connectivity

```sh
curl https://api.example.com
curl -v https://api.example.com
curl -X POST https://api.example.com/token \
  -H "Content-Type: application/json" \
  -d '{"clientId":"test","secret":"test"}'
```