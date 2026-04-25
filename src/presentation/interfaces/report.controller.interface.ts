export interface IReportController {
  list(): Promise<string>;
  detail(reportId: number): Promise<string>;
  createForm(): Promise<string>;
  editForm(reportId: number): Promise<string>;
  create(payload: Record<string, string>): Promise<void>;
  update(reportId: number, payload: Record<string, string>): Promise<void>;
  remove(reportId: number): Promise<void>;
}
