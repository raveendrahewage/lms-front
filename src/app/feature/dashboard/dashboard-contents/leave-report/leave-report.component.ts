import { Component } from '@angular/core';
import { ChartDataModel, ProcessedData } from '../../models/chart-data';
import { LeaveService } from '../../services/leave.service';
import { ToastrService } from 'ngx-toastr';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LeaveReportItem } from '../../models/leave-report-item';

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './leave-report.component.html',
  styleUrl: './leave-report.component.css',
})
export class LeaveReportComponent {
  leaveData: ProcessedData[] = [];
  ngxData: ChartDataModel = {
    data: [
      {
        name: 'leaveTypeName',
        series: [],
      },
    ],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Leave Type';
  showYAxisLabel = true;
  yAxisLabel = 'Leave Requests';
  legendTitle = 'Status';
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#a8385d',
      '#7aa3e5',
      '#a27ea8',
      '#aae3f5',
      '#adcded',
      '#a95963',
      '#8796c0',
      '#7ed3ed',
      '#50abcc',
      '#ad6886',
    ],
  };

  constructor(
    private leaveService: LeaveService,
    private toastr: ToastrService
  ) {
    this.retrieveLeaveReport();
  }

  retrieveLeaveReport() {
    this.leaveService.getLeaveReport().subscribe({
      next: (res) => {
        this.leaveData = this.manipulateData(res.data);
      },
      error: (error) => {
        console.log(error.error.message ?? error.message);
        this.toastr.error(error.error.message ?? error.message);
      },
    });
  }

  manipulateData(data: LeaveReportItem[]): ProcessedData[] {
    const leaveTypeKeyHolder: {
      [key: string]: {
        name: string;
        series: { name: string; value: number }[];
      };
    } = {};
    const finalData: ProcessedData[] = [];
    const helper: { [key: string]: LeaveReportItem } = {};
    const result = data.reduce((r: LeaveReportItem[], o: LeaveReportItem) => {
      const key = o.leaveTypeName + '-' + o.leaveStatusName;

      if (!helper[key]) {
        helper[key] = { ...o };
        r.push(helper[key]);
      } else {
        helper[key].count += o.count;
      }

      return r;
    }, []);

    result.forEach((item) => {
      if (!leaveTypeKeyHolder[item.leaveTypeName]) {
        leaveTypeKeyHolder[item.leaveTypeName] = {
          name: item.leaveTypeName,
          series: [],
        };
        finalData.push(leaveTypeKeyHolder[item.leaveTypeName]);
      }

      leaveTypeKeyHolder[item.leaveTypeName].series.push({
        name: item.leaveTypeName,
        value: item.count,
      });
    });
    return finalData;
  }

  onSelect(event: any) {
    console.log(event);
  }
}
