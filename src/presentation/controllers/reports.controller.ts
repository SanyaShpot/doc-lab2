import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportService, ReportFormInput } from '../../business-logic/services/report.service';
import { CompanyService } from '../../business-logic/services/company.service';
import {
  renderReportDetail,
  renderReportForm,
  renderReportList,
} from '../views/report.view';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportService: ReportService,
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  async list(): Promise<string> {
    const reports = await this.reportService.getAll();
    return renderReportList(
      reports.map(report => ({
        id: report.id,
        companyName: report.company?.name ?? '—',
        quarter: report.quarter,
        year: report.year,
        reportType: report.reportType,
        indicatorCount: report.indicators?.length ?? 0,
      })),
    );
  }

  @Get('new')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async createForm(): Promise<string> {
    const companies = await this.companyService.getAll();
    return renderReportForm({
      title: 'New report',
      action: '/reports',
      submitLabel: 'Create',
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
      })),
    });
  }

  @Post()
  async create(
    @Body() body: ReportFormInput,
    @Res() res: Response,
  ): Promise<void> {
    const report = await this.reportService.createFromForm(body);
    res.redirect(`/reports/${report.id}`);
  }

  @Get(':id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const report = await this.reportService.getById(id);
    return renderReportDetail({
      id: report.id,
      companyName: report.company?.name ?? '—',
      industry: report.company?.industry ?? '—',
      quarter: report.quarter,
      year: report.year,
      reportType: report.reportType,
      indicators:
        report.indicators?.map(indicator => ({
          name: indicator.name,
          value: indicator.value,
          currency: indicator.currency,
        })) ?? [],
    });
  }

  @Get(':id/edit')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async editForm(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const [report, companies] = await Promise.all([
      this.reportService.getById(id),
      this.companyService.getAll(),
    ]);

    const indicatorsText = report.indicators
      ?.map(indicator => `${indicator.name};${indicator.value};${indicator.currency}`)
      .join('\n') ?? '';

    return renderReportForm({
      title: `Edit report #${report.id}`,
      action: `/reports/${report.id}`,
      submitLabel: 'Save',
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
      })),
      report: {
        id: report.id,
        companyId: report.company?.id ?? companies[0]?.id ?? 0,
        quarter: report.quarter,
        year: report.year,
        reportType: report.reportType,
        indicatorsText,
      },
    });
  }

  @Post(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReportFormInput,
    @Res() res: Response,
  ): Promise<void> {
    await this.reportService.updateFromForm(id, body);
    res.redirect(`/reports/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<void> {
    await this.reportService.delete(id);
    res.redirect('/reports');
  }
}
