import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { PaginatedResult } from '../../shared/types/pagination';
import { AuditLog, AuditLogParams } from '../../shared/types/audit-log';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAuditLogs(auditLogParams: AuditLogParams) {
        let params = new HttpParams();
        params = params.append('pageNumber', auditLogParams.pageNumber);
        params = params.append('pageSize', auditLogParams.pageSize);

        if (auditLogParams.date) {
            params = params.append('date', auditLogParams.date);
        }

        return this.http.get<PaginatedResult<AuditLog>>(this.baseUrl + 'audit-logs', { params });
    }
}
