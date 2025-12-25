# Sorting Convention

All collection sorting is handled in the backend.

Resources are ordered using timestamp fields:

- `createdAt` for initial order
- `updatedAt` for recently modified items

The frontend must not compute or persist ordering logic.
