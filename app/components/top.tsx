import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { addDays, format } from "date-fns";
import React, { useEffect, useMemo } from "react";
import ReactDatePicker from "react-datepicker";

import { CsvImport, Row } from "@/components/csv-import";
import { css } from "@/styled-system/css";
import { flex, hstack, stack } from "@/styled-system/patterns";

import "react-datepicker/dist/react-datepicker.css";
import { DisplayTable } from "./display-table";
import { IconButton } from "./icon-button";

// @ts-expect-error otherwise it doesn't work
const DatePicker = ReactDatePicker.default;

export function Index() {
  const [data, setData] = React.useState<Record<string, Array<Row>>>({});
  const [selectedData, setSelectedData] = React.useState<
    Array<Omit<Row, "timestamp">>
  >([]);
  const [targetDate, setTargetDate] = React.useState<Date>(
    new Date().getDate() === 1 ? addDays(new Date(), -1) : new Date()
  );

  const targetDateStr = useMemo(
    () => format(targetDate, "yyyy/M/d"),
    [targetDate]
  );

  const handleLoaded = (d: Record<string, Array<Row>>) => {
    setData(d);
  };

  useEffect(() => {
    setSelectedData(
      data[targetDateStr]
        ?.sort((a, b) => a.timestamp - b.timestamp)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
        .map(({ timestamp, ...v }) => v) ?? []
    );
  }, [data, targetDateStr]);

  return (
    <>
      <div
        className={flex({
          justifyContent: "center",
          bg: "gray.50",
          minH: "100dvh",
          w: "full",
        })}
      >
        <div className={stack({ maxW: "1500px", w: "full", gap: 8, px: 8 })}>
          <div>
            <h1
              className={css({
                mt: 6,
                mb: 2,
                fontWeight: "700",
                fontSize: "3xl",
              })}
            >
              きょうのよてい⛅
            </h1>
            <h2 className={css({ mt: 6, mb: 2 })}>使い方</h2>
            <ul>
              <li>
                Outlookから予定表をエクスポートします。(参考:
                <a
                  href="https://www.syscr.co.jp/blog/%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF/office365/p3371/"
                  color="teal.500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Outlook予定表（カレンダー）をCSVで出力する方法
                  <ExternalLinkIcon mx="2px" />
                </a>
                )
              </li>
              <li>エクスポートしたCSVファイルをアップロードします。</li>
              <li>表示したい日付を指定します。</li>
            </ul>
          </div>
          <CsvImport onLoaded={handleLoaded} />
          <div>
            <h3 className={css({ fontSize: "2xl", mt: 6, mb: 4 })}>日付</h3>
            <div className={hstack({ gap: 2, alignItems: "center" })}>
              <IconButton
                onClick={() => setTargetDate((prev) => addDays(prev, -1))}
              >
                <ChevronLeftIcon />
              </IconButton>
              <DatePicker
                selected={targetDate}
                onChange={(date: unknown) =>
                  date instanceof Date &&
                  !Number.isNaN(date.getTime()) &&
                  setTargetDate(date)
                }
                dateFormat="yyyy/MM/dd"
                showPopperArrow={false}
                customInput={
                  <input className={css({ w: "150px", bg: "white" })} />
                }
              />
              <IconButton
                onClick={() => setTargetDate((prev) => addDays(prev, 1))}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </div>
          <DisplayTable data={selectedData} />
        </div>
      </div>
    </>
  );
}
