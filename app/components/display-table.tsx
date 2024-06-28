import { CloseIcon } from "@chakra-ui/icons";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

import { IconButton } from "./icon-button";

export type Row = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type Props = {
  data: Array<Row>;
};
export function DisplayTable({ data }: Props): JSX.Element {
  const [tData, setTData] = useState<{
    allIds: Array<string>;
    byIds: Record<string, Row>;
  }>({
    allIds: [],
    byIds: {},
  });
  const [focusId, setFocusId] = useState<string | null>(null);

  const resultStr = Object.entries(
    tData.allIds.reduce<Record<string, string>>((acc, id) => {
      const target = tData.byIds[id];
      const key = target.title;
      if (!key || !target.start || !target.end) {
        return acc;
      }

      const value = acc[key] ? `${acc[key]}\n` : "";
      return { ...acc, [key]: `${value}${target.start}-${target.end}` };
    }, {})
  )
    .map(([title, value]) => `"${title}"\t\t"${value}"`)
    .join("\n");

  useEffect(() => {
    setTData({
      allIds: data.map(({ id }) => id),
      byIds: Object.fromEntries(data.map((d) => [d.id, d])),
    });
  }, [data]);

  useEffect(() => {
    if (focusId) {
      const target = document.querySelector(`#${focusId}`);
      if (target instanceof HTMLElement) {
        target.focus();
      }
      setFocusId(null);
    }
  }, [focusId]);

  return (
    <div>
      <table className={css({ w: "full" })}>
        <thead>
          <tr>
            <th className={css({ p: 2, textAlign: "left" })}>予定</th>
            <th className={css({ p: 2, textAlign: "left", w: "110px" })}>
              開始時間
            </th>
            <th className={css({ p: 2, textAlign: "left", w: "110px" })}>
              終了時間
            </th>
            <th className={css({ p: 2, w: "40px" })}></th>
          </tr>
        </thead>
        <tbody>
          {tData.allIds.map((id) => (
            <tr key={id}>
              <td className={css({ p: 2 })}>
                <input
                  id={id}
                  className={css({ w: "full" })}
                  value={tData.byIds[id].title}
                  onChange={({ target }) =>
                    setTData({
                      ...tData,
                      byIds: {
                        ...tData.byIds,
                        [id]: {
                          ...tData.byIds[id],
                          title: target.value,
                        },
                      },
                    })
                  }
                />
              </td>
              <td className={css({ p: 2 })}>
                <input
                  type="text"
                  className={css({ w: "full" })}
                  value={tData.byIds[id].start}
                  onChange={({ target }) => {
                    const v = target.value
                      .replaceAll(/[^\d:]/g, "")
                      .replaceAll(/^(\d{2})(\d)$/g, "$1:$2");
                    return setTData({
                      ...tData,
                      byIds: {
                        ...tData.byIds,
                        [id]: {
                          ...tData.byIds[id],
                          start: v,
                        },
                      },
                    });
                  }}
                />
              </td>
              <td className={css({ p: 2 })}>
                <input
                  type="text"
                  className={css({ w: "full" })}
                  value={tData.byIds[id].end}
                  onChange={({ target }) => {
                    const v = target.value
                      .replaceAll(/[^\d:]/g, "")
                      .replaceAll(/^(\d{2})(\d)$/g, "$1:$2");
                    return setTData({
                      ...tData,
                      byIds: {
                        ...tData.byIds,
                        [id]: {
                          ...tData.byIds[id],
                          end: v,
                        },
                      },
                    });
                  }}
                />
              </td>
              <td className={css({ p: 1 })}>
                <IconButton
                  onClick={() =>
                    setTData({
                      allIds: tData.allIds.filter((i) => i !== id),
                      byIds: Object.fromEntries(
                        Object.entries(tData.byIds).filter(([k]) => k !== id)
                      ),
                    })
                  }
                >
                  <CloseIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        onClick={() => {
          const id = nanoid();
          setFocusId(id);
          return setTData({
            allIds: [...tData.allIds, id],
            byIds: {
              ...tData.byIds,
              [id]: {
                id,
                title: "",
                start: "",
                end: "",
              },
            },
          });
        }}
      >
        行を追加する
      </button>
      <div>
        <h3 className={css({ fontSize: "2xl", mt: 8, mb: 4 })}>出力データ</h3>
        <textarea
          className={css({ bg: "white", w: "full" })}
          name="result"
          rows={6}
          readOnly
          value={resultStr}
        />
      </div>
    </div>
  );
}
