import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import "./App.css";
function earnedSalaryUntilNow(
  monthlySalary: number,
  startHour: number,
  endHour: number
): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  let totalWorkSeconds = 0;
  let workedSecondsUntilNow = 0;

  for (
    let day = firstDayOfMonth;
    day <= lastDayOfMonth;
    day.setDate(day.getDate() + 1)
  ) {
    // 確認する日の曜日（月曜=1, 火曜=2, ..., 日曜=0）
    if (day.getDay() !== 0 && day.getDay() !== 6) {
      // 秒単位で1日の労働時間を計算
      const dailyWorkSeconds = (endHour - startHour) * 3600;
      totalWorkSeconds += dailyWorkSeconds;

      // 現在の時刻を超えていない日の労働時間を計算
      if (day < now) {
        let workSecondsToday = dailyWorkSeconds;

        // 今日が含まれている場合、今日の実際の労働時間を計算する
        if (day.toDateString() === now.toDateString()) {
          const currentTime = now.getHours() + now.getMinutes() / 60;
          if (currentTime < startHour) {
            workSecondsToday = 0;
          } else if (currentTime < endHour) {
            workSecondsToday = (currentTime - startHour) * 3600;
          }
        }
        workedSecondsUntilNow += workSecondsToday;
      }
    }
  }

  return (monthlySalary * workedSecondsUntilNow) / totalWorkSeconds;
}

function App() {
  const [monthlySalary, setMonthlySalary] = useState(300000);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [earnedSalary, setEarnedSalary] = useState(
    earnedSalaryUntilNow(monthlySalary, startHour, endHour)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setEarnedSalary(earnedSalaryUntilNow(monthlySalary, startHour, endHour));
    }, 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, [monthlySalary, startHour, endHour]);

  return (
    <>
      <Accordion className="my-3" defaultExpanded>
        <AccordionSummary id="settings" expandIcon={<ExpandMoreIcon />}>
          設定
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                id="outlined-number"
                label="月給（円）"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
              />
            </Grid>
            <Grid item>
              <TextField
                id="outlined-number"
                label="始業時刻（時）"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
              />
            </Grid>
            <Grid item>
              <TextField
                id="outlined-number"
                label="終業時刻（時）"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <div className="flex items-end place-content-center h-36">
        <div className="text-7xl sm:text-9xl font-bold">
          {Math.floor(earnedSalary).toLocaleString()}
        </div>
        <div className="text-4xl font-bold ml-5">円</div>
      </div>
    </>
  );
}

export default App;
