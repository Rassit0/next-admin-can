export interface IDisciplineOptions {
  id: string;
  name: string;
  icon: string;
}

export interface IDisciplineOptionsResponse {
  data: IDisciplineOptions[];
  message: string;
}
