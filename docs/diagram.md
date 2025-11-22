# Diagrama de datos

```mermaid
erDiagram

    client_apps {
        int id PK
        string app_name
        string app_logo_url
        string client_id
        string client_secret
        string redirect_uri
        datetime created_at
        datetime updated_at
    }

    users {
        int id PK
        string rut
        string email
        string password_hash
        enum account_status
        datetime created_at
        datetime updated_at
    }

    user_profile_fields {
        int id PK
        int user_id FK
        string field_key
        string category
        string field_value
        enum(data_type) data_type
        enum validation_status
        string validation_source
        string validation_notes
        datetime verified_at
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    user_files {
        int id PK
        int user_id FK
        int user_profile_field_id FK
        string file_type
        string storage_url
        string mime_type
        int file_size_bytes
        enum validation_status
        string validation_source
        string validation_notes
        datetime verified_at
        boolean is_active
        datetime uploaded_at
    }

    user_field_permissions {
        int id PK
        int user_id FK
        int client_app_id FK
        string field_key
        int user_file_id FK
        boolean allowed
        datetime granted_at
        datetime revoked_at
    }

    %% RELATIONSHIPS

    users ||--o{ user_profile_fields : "posee"
    users ||--o{ user_files : "posee"
    users ||--o{ user_field_permissions : "otorga permiso"
    client_apps ||--o{ user_field_permissions : "recibe permisos"
    user_profile_fields ||--o{ user_files : "usa_archivos_como_evidencia"
    user_files ||--o{ user_field_permissions : "es_accesible_por"
```


## 🧩 ENUMS UTILIZADOS

Para que quede claro cómo se interpretan:

### **validation_status**

* `pending`
* `verified`
* `rejected`
* `not_requested`

### **data_type**

* `string`
* `number`
* `date`
* `boolean`
* `file` (si aplicara en futuro)

### **account_status**

* `active`
* `blocked`
* `pending_verification`