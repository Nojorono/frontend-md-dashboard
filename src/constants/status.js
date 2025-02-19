export const STATUS_PROCESSING = 100;
export const STATUS_HO_PROCESSING = 101;

export const STATUS_NOT_VISITED = 400;
export const STATUS_TEMP_CLOSED = 401;
export const STATUS_PERM_CLOSED = 402;
export const STATUS_NOT_FOUND = 403;
export const STATUS_REJECTED = 404;
export const STATUS_CANCELLED = 405;
export const STATUS_PIC_REJECTED = 406;
export const STATUS_HO_REJECTED = 407;

export const STATUS_VISITED = 200;
export const STATUS_COMPLETED = 201;
export const STATUS_OUTLET_AGREED = 202;
export const STATUS_APPROVED = 203;

// MD Activity Status Codes
export const EXISTING_SURVEY_STATUS = {
  [STATUS_NOT_VISITED]: 'Belum Dikunjungi',
  // for md
  [STATUS_PROCESSING]: 'Proses Dikunjungi',
  [STATUS_TEMP_CLOSED]: 'Outlet Tutup Sementara',
  [STATUS_PERM_CLOSED]: 'Outlet Tutup Permanen', 
  [STATUS_NOT_FOUND]: 'Outlet Tidak Ditemukan',
  [STATUS_VISITED]: 'Sudah Dikunjungi',
  [STATUS_COMPLETED]: 'Selesai',

  [STATUS_PIC_REJECTED]: 'Ditolak PIC',
  [STATUS_HO_REJECTED]: 'Ditolak HO',
  [STATUS_HO_PROCESSING]: 'Proses HO',
  [STATUS_CANCELLED]: 'Schedule Dibatalkan',
};

// Survey Activity Status Codes
export const NEW_SURVEY_STATUS = {
  // for md
  [STATUS_PROCESSING]: 'Proses Dikunjungi',
  [STATUS_OUTLET_AGREED]: 'Outlet Setuju',
  [STATUS_TEMP_CLOSED]: 'Outlet Tutup Sementara',
  [STATUS_PERM_CLOSED]: 'Outlet Tutup Permanen', 
  [STATUS_NOT_FOUND]: 'Outlet Tidak Ditemukan',
  [STATUS_REJECTED]: 'Outlet Menolak',
  [STATUS_VISITED]: 'Sudah Dikunjungi',
  [STATUS_NOT_VISITED]: 'Belum Dikunjungi',
  [STATUS_PIC_REJECTED]: 'Ditolak PIC',
  [STATUS_HO_PROCESSING]: 'Proses HO',
  [STATUS_HO_REJECTED]: 'Ditolak HO',
  [STATUS_APPROVED]: 'Disetujui HO',
};

// Status color mapping
export const STATUS_COLORS = {
  [STATUS_PROCESSING]: 'info',
  [STATUS_HO_PROCESSING]: 'info',
  [STATUS_NOT_VISITED]: 'warning',
  [STATUS_TEMP_CLOSED]: 'warning',
  [STATUS_PERM_CLOSED]: 'error',
  [STATUS_NOT_FOUND]: 'error',
  [STATUS_REJECTED]: 'error',
  [STATUS_CANCELLED]: 'error',
  [STATUS_PIC_REJECTED]: 'error',
  [STATUS_HO_REJECTED]: 'error',
  [STATUS_VISITED]: 'success',
  [STATUS_COMPLETED]: 'success',
  [STATUS_OUTLET_AGREED]: 'success',
  [STATUS_APPROVED]: 'success',
};

export const getStatusLabel = (value) => {
  return EXISTING_SURVEY_STATUS[value] ? EXISTING_SURVEY_STATUS[value] : NEW_SURVEY_STATUS[value];
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status];
};
