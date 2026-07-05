export interface IDisciplineOption {
  id: string;
  name: string;
  icon: string;
}

export interface IDisciplineOptionsResponse {
  data: IDisciplineOption[];
  message: string;
}
