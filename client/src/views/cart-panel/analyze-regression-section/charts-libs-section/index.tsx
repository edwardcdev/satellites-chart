import React, { useState } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";

import MinusAddon from "../../../../components/Button/MinusAddon";
import PlusAddon from "../../../../components/Button/PlusAddon";
import SelectedChartSection from "./selected-chart-section";
import * as Constants from "../../../../constants";

function ChartsLibsSection(props: any) {
  const [selected, setSelected] = useState([1, 2, 3] as any);
  const [anchorEl, setAnchorEl] = useState(null as any);

  const handleSelected = (id: any, type: string) => {
    if (!selected.includes(id) && type === "add") {
      setSelected((prevState: any) => [...prevState, id]);
    } else if (type === "remove") {
      setSelected(selected.filter((item: any) => item !== id));
    }
    setAnchorEl(null);
  };

  return (
    <>
      {selected.length === 0 && (
        <PlusAddon
          type={0}
          selected={selected}
          anchorEl={anchorEl}
          onAnchorEl={(value: any) => setAnchorEl(value)}
          onSelected={(value: any) => handleSelected(value, "add")}
        />
      )}
      {selected.map((item: any, idx: number) => {
        let dset = Constants.MENU_ITEMS[props.dataSet][item].dataset;
        return (
          <React.Fragment key={item}>
            <MinusAddon
              id={item}
              type={0}
              selected={selected}
              anchorEl={anchorEl}
              onAnchorEl={(value: any) => setAnchorEl(value)}
              onSelected={(value: any) => handleSelected(value, "remove")}
            />
            <Grid item md={12}>
              <Card style={{ marginLeft: "2.5rem", marginRight: "2.5rem" }}>
                <CardContent>
                  {props.traces[dset] &&
                    Object.keys(props.traces[dset]).length > 0 && (
                      <SelectedChartSection
                        id={item}
                        data={props.traces[dset]}
                        dataType={props.dataType}
                      />
                    )}
                </CardContent>
              </Card>
            </Grid>
            {idx === selected.length - 1 && (
              <PlusAddon
                type={0}
                selected={selected}
                anchorEl={anchorEl}
                onAnchorEl={(value: any) => setAnchorEl(value)}
                onSelected={(value: any) => handleSelected(value, "add")}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default ChartsLibsSection;
