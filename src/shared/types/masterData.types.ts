export interface Province {
  id: string;
  code: string;
  nameEn: string;
  nameNp: string;
  capitalEn: string;
  capitalNp: string;
  areaKm2: number;
  population2021: number;
  districtCount: number;
}

export interface District {
  id: string;
  code: string;
  nameEn: string;
  nameNp: string;
  headquarters: string;
  provinceId: string;
  provinceCode: string;
  provinceNameEn: string;
  areaKm2: number;
  population2021: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
}
