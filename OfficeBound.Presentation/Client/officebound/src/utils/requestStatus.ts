import { TFunction } from 'i18next';

export const getRequestStatusLabels = (t: TFunction): Record<number, string> => {
    return {
        0: t('request.status.approved'),
        1: t('request.status.rejected'),
        2: t('request.status.cancelled'),
        3: t('request.status.pending'),
        4: t('request.status.expired')
    };
};

export const getRequestStatusLabel = (status: number, t: TFunction): string => {
    const statusLabels = getRequestStatusLabels(t);
    return statusLabels[status] || 'Unknown';
};

export const getRequestStatusColor = (status: number): "success" | "error" | "warning" | "default" | "info" => {
    const colorMap: Record<number, "success" | "error" | "warning" | "default" | "info"> = {
        0: 'success',
        1: 'error',
        2: 'warning',
        3: 'info',
        4: 'default'
    };
    return colorMap[status] || 'default';
};

