# Database Schema Documentation

This project uses **MongoDB** as its database, with **Mongoose** as the Object Data Modeling (ODM) library.

Below are the documented collections and their schemas:

## 1. Users (`users` collection)
Stores information about the internal users (e.g., Sales Users, Admins) who access the dashboard.

| Field | Type | Description | Constraints |
| --- | --- | --- | --- |
| `_id` | ObjectId | Unique identifier | Automatically generated |
| `name` | String | Full name of the user | Required, 2-50 characters |
| `email` | String | Email address | Required, Unique, Valid Email |
| `password` | String | Encrypted password | Required, Min 6 chars (Stored hashed) |
| `role` | String | Access role | Enum (`Admin`, `Sales User`), Default: `Sales User` |
| `createdAt` | Date | Timestamp of creation | Automatically generated |
| `updatedAt` | Date | Timestamp of last update | Automatically generated |

## 2. Leads (`leads` collection)
Stores information about prospective clients (leads) and tracks their current status.

| Field | Type | Description | Constraints |
| --- | --- | --- | --- |
| `_id` | ObjectId | Unique identifier | Automatically generated |
| `name` | String | Full name of the lead | Required, 2-100 characters |
| `email` | String | Email address of lead | Required, Valid Email |
| `status` | String | Current pipeline status | Enum (`New`, `Contacted`, `Qualified`, `Lost`), Default: `New` |
| `source` | String | Where the lead came from | Enum (`Website`, `Referral`, `Cold Call`, `Other`), Required |
| `createdBy` | ObjectId | The user who added the lead | Reference to `User` model, Required |
| `createdAt` | Date | Timestamp of creation | Automatically generated |
| `updatedAt` | Date | Timestamp of last update | Automatically generated |

### Indexes (Leads)
- `status` (Ascending)
- `source` (Ascending)
- `createdBy` (Ascending)
- `createdAt` (Descending)
- Text Index on `name` and `email` for searching.
