import React from "react";
import { Grid, IconButton, Divider } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Selection from "../Select";

function PlusAddon(props: any) {
  return (
    <Grid item md={12}>
      <Grid container justify="center" alignItems="center">
        <Grid item style={{ width: "4%" }}>
          <IconButton onClick={(e) => props.onAnchorEl(e.currentTarget)}>
            <AddCircleOutlineIcon />
          </IconButton>
          <Selection
            selected={props.selected}
            anchorEl={props.anchorEl}
            onAnchorEl={(value: any) => props.onAnchorEl(value)}
            onSelected={(value: any) => props.onSelected(value)}
          />
        </Grid>
        <Grid item md={11} style={{ width: "96%" }}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PlusAddon;
