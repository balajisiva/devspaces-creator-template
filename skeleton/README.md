# {{ values.displayName }}

{{ values.description }}

Generated with the OpenShift DevSpaces Devfile Creator template.

## Stack Information

- **Technology**: {{ values.techStack }}
- **Language**: {{ values.language }}
- **Container Image**: {{ values.containerImage }}
{% if values.includeDatabase -%}
- **Database**: {{ values.databaseType }}
{% endif -%}

## Getting Started

### Option 1: Open in DevSpaces

Click the badge below to open this workspace in OpenShift DevSpaces:

[![Open in DevSpaces](https://img.shields.io/badge/DevSpaces-Open-blue?logo=eclipseche)]({{ values.devspacesUrl }}#https://github.com/{{ values.owner }}/{{ values.name }})

Or manually:
1. Go to your DevSpaces instance: {{ values.devspacesUrl }}
2. Click "Create Workspace"
3. Enter this repository URL: `https://github.com/{{ values.owner }}/{{ values.name }}`

### Option 2: Local Development

Clone this repository:
```bash
git clone https://github.com/{{ values.owner }}/{{ values.name }}.git
cd {{ values.name }}
```

{% if values.techStack == 'nodejs' or values.techStack == 'react' or values.techStack == 'angular' or values.techStack == 'vue' -%}
Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run tests:
```bash
npm test
```
{% elif values.techStack == 'java-spring' -%}
Build the project:
```bash
mvn clean package
```

Run the application:
```bash
mvn spring-boot:run
```

Run tests:
```bash
mvn test
```
{% elif values.techStack == 'python-django' -%}
Install dependencies:
```bash
pip install -r requirements.txt
```

Run migrations:
```bash
python manage.py migrate
```

Run development server:
```bash
python manage.py runserver {{ values.mainPort }}
```

Run tests:
```bash
python manage.py test
```
{% elif values.techStack == 'go' -%}
Build the application:
```bash
go build -o app .
```

Run the application:
```bash
go run .
```

Run tests:
```bash
go test ./...
```
{% elif values.techStack == 'dotnet' -%}
Build the application:
```bash
dotnet build
```

Run the application:
```bash
dotnet run
```

Run tests:
```bash
dotnet test
```
{% endif %}

## DevSpaces Configuration

The workspace is configured with:

- **Memory Limit**: {{ values.memoryLimit }}
- **CPU Limit**: {{ values.cpuLimit }}
- **Main Port**: {{ values.mainPort }}
{% if values.persistentStorage -%}
- **Persistent Storage**: Enabled ({{ values.volumeSize }} per volume)
{% endif -%}
{% if values.autoStart -%}
- **Auto-start**: Application starts automatically when workspace loads
{% endif -%}

{% if values.includeDatabase -%}
## Database Configuration

This workspace includes a {{ values.databaseType }} database:

- **Database Name**: {{ values.databaseName }}
- **Username**: devuser
- **Password**: devpassword
{% if values.databaseType == 'postgresql' -%}
- **Connection URL**: `postgresql://devuser:devpassword@postgres:5432/{{ values.databaseName }}`
- **Port**: 5432
{% elif values.databaseType == 'mysql' -%}
- **Connection URL**: `mysql://devuser:devpassword@mysql:3306/{{ values.databaseName }}`
- **Port**: 3306
{% elif values.databaseType == 'mongodb' -%}
- **Connection URL**: `mongodb://devuser:devpassword@mongodb:27017/{{ values.databaseName }}`
- **Port**: 27017
{% elif values.databaseType == 'redis' -%}
- **Host**: redis
- **Port**: 6379
{% endif -%}

**Note**: These are development credentials. Never use them in production!
{% endif -%}

{% if values.additionalServices and values.additionalServices|length > 0 -%}
## Additional Services

This workspace includes the following additional services:

{% if 'redis' in values.additionalServices -%}
### Redis
- **Host**: redis
- **Port**: 6379
{% endif -%}

{% if 'rabbitmq' in values.additionalServices -%}
### RabbitMQ
- **AMQP Port**: 5672
- **Management UI**: Port 15672
- **Username**: guest
- **Password**: guest
{% endif -%}

{% if 'kafka' in values.additionalServices -%}
### Kafka
- **Broker**: kafka:9092
{% endif -%}

{% if 'elasticsearch' in values.additionalServices -%}
### Elasticsearch
- **Host**: elasticsearch
- **Port**: 9200
{% endif -%}
{% endif -%}

## Available Commands

In DevSpaces, you can use these commands:

{% if values.techStack == 'nodejs' or values.techStack == 'react' or values.techStack == 'angular' or values.techStack == 'vue' -%}
- `install` - Install npm dependencies
- `build` - Build the application
- `run` - Run development server
- `test` - Run tests
- `lint` - Lint code
{% elif values.techStack == 'java-spring' -%}
- `build` - Build with Maven
- `run` - Run Spring Boot application
- `test` - Run tests
{% elif values.techStack == 'python-django' -%}
- `install` - Install pip dependencies
- `migrate` - Run database migrations
- `run` - Run Django development server
- `test` - Run tests
{% elif values.techStack == 'go' -%}
- `build` - Build Go application
- `run` - Run Go application
- `test` - Run tests
{% elif values.techStack == 'dotnet' -%}
- `build` - Build .NET application
- `run` - Run .NET application
- `test` - Run tests
{% endif %}

## Project Structure

```
{{ values.name }}/
├── devfile.yaml          # DevSpaces workspace configuration
├── catalog-info.yaml     # Backstage catalog entry
├── README.md            # This file
└── .devcontainer/       # VS Code devcontainer config (optional)
```

## Resources

- [Devfile Documentation](https://devfile.io/)
- [OpenShift DevSpaces](https://developers.redhat.com/products/openshift-dev-spaces/overview)
- [Backstage Documentation](https://backstage.io/docs)

## Support

- **Owner**: {{ values.owner }}
- **Issues**: https://github.com/{{ values.owner }}/{{ values.name }}/issues

---

Generated by OpenShift DevSpaces Devfile Creator | {{ values.currentYear | default(2024) }}
