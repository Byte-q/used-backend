# FULLSCO Backend Deployment Guide

This guide covers all deployment options for the FULLSCO backend API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (for containerized deployment)

### 1. Local Development

```bash
# Clone and setup
git clone <repository-url>
cd fullsco-backend
npm install

# Environment setup
cp env.example .env
# Edit .env with your database credentials

# Database setup
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### 2. Docker Development

```bash
# Start all services
docker-compose up -d

# Setup database (first time)
docker-compose --profile setup up db-setup

# View logs
docker-compose logs -f backend
```

## 🐳 Production Deployment

### Option 1: Docker Compose (Recommended)

#### 1. Prepare Environment
```bash
# Copy and configure environment
cp env.example .env
nano .env
```

#### 2. Deploy
```bash
# Using deployment script
./deploy.sh deploy

# Or manually
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 3. Verify Deployment
```bash
# Check status
./deploy.sh status

# View logs
./deploy.sh logs

# Health check
curl http://localhost:5000/health
```

### Option 2: Manual Server Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2
sudo npm install -g pm2
```

#### 2. Application Setup
```bash
# Clone repository
git clone <repository-url>
cd fullsco-backend

# Install dependencies
npm install

# Build application
npm run build

# Setup environment
cp env.example .env
nano .env
```

#### 3. Database Setup
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE fullsco_db;
CREATE USER fullsco_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fullsco_db TO fullsco_user;
\q

# Run migrations
npm run db:migrate
npm run db:seed
```

#### 4. Start with PM2
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 monit
```

### Option 3: Cloud Platform Deployment

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

#### Heroku
```bash
# Install Heroku CLI
# Create app and add PostgreSQL
heroku create fullsco-backend
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SESSION_SECRET=your-session-secret

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
```

#### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables
3. Configure build settings
4. Deploy automatically

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | No | Server port | `5000` |
| `NODE_ENV` | No | Environment mode | `production` |
| `JWT_SECRET` | Yes | JWT signing secret | `your-super-secret-key` |
| `SESSION_SECRET` | Yes | Session secret | `your-session-secret` |
| `CORS_ORIGIN` | No | Allowed CORS origin | `https://yourdomain.com` |
| `UPLOAD_DIR` | No | Upload directory | `./uploads` |
| `MAX_FILE_SIZE` | No | Max file size (bytes) | `5242880` |

### Database Configuration

#### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE fullsco_db;

-- Create user
CREATE USER fullsco_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fullsco_db TO fullsco_user;
GRANT ALL ON SCHEMA public TO fullsco_user;
```

#### Connection String Format
```
postgresql://username:password@host:port/database
```

### SSL Configuration

#### Self-Signed Certificate
```bash
# Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key -out ssl/certificate.crt

# Update nginx.conf with SSL settings
```

#### Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Set strong JWT and session secrets
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database backup strategy
- [ ] Monitor logs and access

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application health
curl http://yourdomain.com/health

# Check database connection
npm run db:studio
```

### Logs
```bash
# Application logs
pm2 logs fullsco-backend

# Docker logs
docker-compose logs -f backend

# System logs
sudo journalctl -u fullsco-backend -f
```

### Backup
```bash
# Database backup
pg_dump fullsco_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Restart application
pm2 restart fullsco-backend
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U fullsco_user -d fullsco_db
```

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

#### Memory Issues
```bash
# Check memory usage
pm2 monit

# Restart with more memory
pm2 restart fullsco-backend --max-memory-restart 1G
```

#### Docker Issues
```bash
# Clean up containers
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Performance Optimization

#### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_scholarships_slug ON scholarships(slug);
CREATE INDEX idx_scholarships_featured ON scholarships(is_featured);
CREATE INDEX idx_scholarships_published ON scholarships(is_published);
```

#### Application Optimization
```bash
# Enable compression
npm install compression

# Use PM2 cluster mode
pm2 start ecosystem.config.js -i max
```

## 📞 Support

For deployment issues:
1. Check the logs: `./deploy.sh logs`
2. Verify environment variables
3. Test database connection
4. Check firewall settings
5. Review security configuration

---

**Need help?** Create an issue in the repository or contact the development team. 