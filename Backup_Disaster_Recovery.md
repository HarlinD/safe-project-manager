# Backup & Disaster Recovery Strategy
# SAFe Project Manager Application

## 🎯 **Översikt**

Denna dokumentation beskriver backup- och disaster recovery-strategin för SAFe-projektledningsappen, inklusive databas, cache, filer och applikationskonfiguration.

## 📊 **Kritiska Komponenter**

### **1. PostgreSQL Database**
- **Data**: Alla transaktionella data (organizations, users, release trains, features, etc.)
- **Kritiska tabeller**: users, organizations, release_trains, features, risks
- **Backup-frekvens**: Daglig full backup + kontinuerlig WAL-archiving
- **RTO (Recovery Time Objective)**: < 4 timmar
- **RPO (Recovery Point Objective)**: < 1 timme

### **2. Redis Cache**
- **Data**: Session data, dashboard cache, real-time data
- **Backup-frekvens**: Var 6:e timme
- **RTO**: < 1 timme
- **RPO**: < 15 minuter

### **3. File Storage (S3/MinIO)**
- **Data**: Dokument, attachments, exports
- **Backup-frekvens**: Kontinuerlig replication
- **RTO**: < 2 timmar
- **RPO**: < 30 minuter

### **4. Application Code**
- **Data**: Source code, configuration files
- **Backup-frekvens**: Kontinuerlig via Git
- **RTO**: < 1 timme
- **RPO**: Real-time

## 🔄 **Backup-strategier**

### **PostgreSQL Backup**

#### **1. Full Database Backup**
```bash
#!/bin/bash
# daily-backup.sh

BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="safe_pm"
DB_USER="safe_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_DIR/full_backup_$DATE.dump"

# Compress backup
gzip "$BACKUP_DIR/full_backup_$DATE.dump"

# Upload to S3
aws s3 cp "$BACKUP_DIR/full_backup_$DATE.dump.gz" \
  s3://safe-pm-backups/postgresql/full/

# Cleanup old local backups (keep 7 days)
find $BACKUP_DIR -name "full_backup_*.dump.gz" -mtime +7 -delete

echo "Full backup completed: $DATE"
```

#### **2. WAL Archiving (Point-in-Time Recovery)**
```bash
# postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'aws s3 cp %p s3://safe-pm-backups/postgresql/wal/%f'
max_wal_senders = 3
wal_keep_segments = 64
```

#### **3. Incremental Backup**
```bash
#!/bin/bash
# incremental-backup.sh

BACKUP_DIR="/backups/postgresql/incremental"
DATE=$(date +%Y%m%d_%H%M%S)

# Create incremental backup
pg_basebackup -h localhost -U $DB_USER \
  -D "$BACKUP_DIR/incremental_$DATE" \
  -Ft -z -P

# Upload to S3
aws s3 sync "$BACKUP_DIR/incremental_$DATE" \
  s3://safe-pm-backups/postgresql/incremental/$DATE/

echo "Incremental backup completed: $DATE"
```

### **Redis Backup**

#### **1. RDB Snapshot Backup**
```bash
#!/bin/bash
# redis-backup.sh

BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d_%H%M%S)

# Trigger RDB snapshot
redis-cli BGSAVE

# Wait for backup to complete
while [ $(redis-cli LASTSAVE) -eq $(redis-cli LASTSAVE) ]; do
  sleep 1
done

# Copy RDB file
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/dump_$DATE.rdb"

# Upload to S3
aws s3 cp "$BACKUP_DIR/dump_$DATE.rdb" \
  s3://safe-pm-backups/redis/

echo "Redis backup completed: $DATE"
```

#### **2. AOF Backup (Append Only File)**
```bash
# redis.conf
appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

### **File Storage Backup**

#### **S3 Cross-Region Replication**
```json
{
  "Role": "arn:aws:iam::account:role/replication-role",
  "Rules": [
    {
      "Status": "Enabled",
      "Priority": 1,
      "DeleteMarkerReplication": {
        "Status": "Disabled"
      },
      "Filter": {
        "Prefix": ""
      },
      "Destination": {
        "Bucket": "arn:aws:s3:::safe-pm-backups-dr",
        "StorageClass": "STANDARD_IA"
      }
    }
  ]
}
```

## 🚨 **Disaster Recovery Procedures**

### **Scenario 1: Database Failure**

#### **Recovery Steps**
1. **Assess Damage**
   ```bash
   # Check database status
   systemctl status postgresql
   journalctl -u postgresql -n 50
   ```

2. **Restore from Backup**
   ```bash
   # Stop application
   docker-compose down
   
   # Restore database
   aws s3 cp s3://safe-pm-backups/postgresql/full/latest.dump.gz .
   gunzip latest.dump.gz
   
   # Drop and recreate database
   dropdb -U postgres safe_pm
   createdb -U postgres safe_pm
   
   # Restore data
   pg_restore -U postgres -d safe_pm latest.dump
   
   # Start application
   docker-compose up -d
   ```

3. **Verify Recovery**
   ```bash
   # Check database connectivity
   psql -U safe_user -d safe_pm -c "SELECT COUNT(*) FROM organizations;"
   
   # Check application health
   curl http://localhost:3016/health
   ```

### **Scenario 2: Complete System Failure**

#### **Recovery Steps**
1. **Provision New Infrastructure**
   ```bash
   # Using Terraform
   terraform init
   terraform plan
   terraform apply
   ```

2. **Restore Database**
   ```bash
   # Install PostgreSQL
   apt-get update
   apt-get install postgresql-15
   
   # Restore from backup
   aws s3 cp s3://safe-pm-backups/postgresql/full/latest.dump.gz .
   gunzip latest.dump.gz
   pg_restore -U postgres -d safe_pm latest.dump
   ```

3. **Restore Application**
   ```bash
   # Clone repository
   git clone https://github.com/company/safe-project-manager.git
   cd safe-project-manager
   
   # Deploy application
   docker-compose up -d
   ```

4. **Restore Cache**
   ```bash
   # Install Redis
   apt-get install redis-server
   
   # Restore Redis data
   aws s3 cp s3://safe-pm-backups/redis/latest.rdb /var/lib/redis/dump.rdb
   systemctl restart redis-server
   ```

### **Scenario 3: Data Corruption**

#### **Recovery Steps**
1. **Point-in-Time Recovery**
   ```bash
   # Stop application
   docker-compose down
   
   # Restore to specific point in time
   pg_restore -U postgres -d safe_pm \
     --clean --if-exists \
     --create \
     latest.dump
   
   # Apply WAL files for PITR
   pg_receivewal -D /var/lib/postgresql/wal_restore \
     --until="2024-01-15 14:30:00"
   ```

2. **Verify Data Integrity**
   ```sql
   -- Check data consistency
   SELECT COUNT(*) FROM organizations;
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM release_trains;
   
   -- Check foreign key constraints
   SELECT * FROM pg_constraint WHERE contype = 'f';
   ```

## 📋 **Monitoring & Alerting**

### **Backup Monitoring**
```bash
#!/bin/bash
# backup-monitor.sh

# Check if backup exists
if ! aws s3 ls s3://safe-pm-backups/postgresql/full/ | grep $(date +%Y%m%d); then
  echo "ALERT: Daily backup missing for $(date +%Y%m%d)"
  # Send alert to Slack/Email
fi

# Check backup size
BACKUP_SIZE=$(aws s3 ls s3://safe-pm-backups/postgresql/full/ --recursive | tail -1 | awk '{print $3}')
if [ $BACKUP_SIZE -lt 1000000 ]; then
  echo "ALERT: Backup size suspiciously small: $BACKUP_SIZE bytes"
fi
```

### **Health Checks**
```bash
#!/bin/bash
# health-check.sh

# Database health
if ! pg_isready -h localhost -p 5447; then
  echo "ALERT: Database not responding"
fi

# Redis health
if ! redis-cli ping | grep -q PONG; then
  echo "ALERT: Redis not responding"
fi

# Application health
if ! curl -f http://localhost:3016/health; then
  echo "ALERT: Application not responding"
fi
```

## 🔧 **Automation Scripts**

### **Automated Backup Script**
```bash
#!/bin/bash
# automated-backup.sh

set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/backup.log"

echo "$(date): Starting automated backup" >> $LOG_FILE

# Database backup
./scripts/daily-backup.sh
if [ $? -eq 0 ]; then
  echo "$(date): Database backup successful" >> $LOG_FILE
else
  echo "$(date): Database backup failed" >> $LOG_FILE
  exit 1
fi

# Redis backup
./scripts/redis-backup.sh
if [ $? -eq 0 ]; then
  echo "$(date): Redis backup successful" >> $LOG_FILE
else
  echo "$(date): Redis backup failed" >> $LOG_FILE
fi

# File storage backup (already handled by S3 replication)
echo "$(date): File storage backup handled by S3 replication" >> $LOG_FILE

echo "$(date): Automated backup completed" >> $LOG_FILE
```

### **Recovery Testing Script**
```bash
#!/bin/bash
# test-recovery.sh

echo "Testing disaster recovery procedures..."

# Test database restore
echo "Testing database restore..."
docker-compose down
docker-compose up -d db
sleep 30

# Test application connectivity
if curl -f http://localhost:3016/health; then
  echo "✓ Application health check passed"
else
  echo "✗ Application health check failed"
  exit 1
fi

echo "Disaster recovery test completed successfully"
```

## 📊 **Backup Retention Policy**

| Backup Type | Retention Period | Storage Location |
|-------------|------------------|------------------|
| Daily Full Backup | 30 days | S3 Standard |
| Weekly Full Backup | 12 weeks | S3 Standard-IA |
| Monthly Full Backup | 12 months | S3 Glacier |
| WAL Archives | 7 days | S3 Standard |
| Redis Snapshots | 7 days | S3 Standard |
| Application Code | Permanent | Git Repository |

## 🎯 **Recovery Testing Schedule**

- **Weekly**: Automated backup verification
- **Monthly**: Point-in-time recovery test
- **Quarterly**: Full disaster recovery drill
- **Annually**: Complete system recovery test

## 📞 **Emergency Contacts**

- **Primary DBA**: +46-70-123-4567
- **Secondary DBA**: +46-70-123-4568
- **DevOps Team**: devops@techcorp.se
- **Emergency Hotline**: +46-8-123-4567

---

**Dokument version**: 1.0  
**Senast uppdaterad**: 2024-12-19  
**Nästa granskning**: 2025-01-19
