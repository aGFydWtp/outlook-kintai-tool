import { format, parse } from "date-fns";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { readString } from "react-papaparse";

import { css } from "@/styled-system/css";
import { flex, stack } from "@/styled-system/patterns";

export type Row = {
  id: string;
  title: string;
  timestamp: number;
  start: string;
  end: string;
};

type Props = {
  onLoaded: (data: Record<string, Array<Row>>) => void;
};

export function CsvImport({ onLoaded }: Props): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    async (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        try {
          const text = await file.text();
          readString(text, {
            worker: true,
            complete: async (results) => {
              if (results.errors.length > 0) {
                setErrorMessage("読み込みに失敗しました。");
                return;
              }

              const data = results.data
                .filter(
                  (row): row is Array<string> =>
                    Array.isArray(row) &&
                    row.every((d) => typeof d === "string") &&
                    row.length > 5
                )
                .slice(1)
                .reduce<Record<string, Array<Row>>>((acc, row) => {
                  const key = row.at(1);
                  if (!key) {
                    return acc;
                  }
                  const current = acc[key] ?? [];
                  return {
                    ...acc,
                    [key]: [
                      ...current,
                      {
                        id: nanoid(),
                        title: row[0],
                        timestamp: parse(
                          `${row[1]} ${row[2]}`,
                          "yyyy/MM/dd HH:mm:SS",
                          new Date()
                        ).getTime(),
                        start: format(
                          parse(
                            `${row[1]} ${row[2]}`,
                            "yyyy/MM/dd HH:mm:SS",
                            new Date()
                          ),
                          "HH:mm"
                        ),
                        end: format(
                          parse(
                            `${row[3]} ${row[4]}`,
                            "yyyy/MM/dd HH:mm:SS",
                            new Date()
                          ),
                          "HH:mm"
                        ),
                      },
                    ],
                  };
                }, {});
              onLoaded(data);
            },
          });
        } catch (error) {
          console.error("error:", error);
          setErrorMessage("読み込みに失敗しました。");
        }
      });
    },
    [onLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={stack({ gap: 4 })}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <button
            className={flex({
              py: 2,
              px: 4,
              cursor: "pointer",
              rounded: "md",
              bg: "orange.500",
              color: "white",
              _hover: { bg: "orange.600" },
            })}
            type="button"
          >
            ファイルを選択
          </button>
        )}
      </div>
      {errorMessage && (
        <p className={css({ color: "red.400", fontSize: "sm" })}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
