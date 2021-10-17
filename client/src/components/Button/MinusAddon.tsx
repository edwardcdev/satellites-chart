import React from "react";
import {
  Grid,
  IconButton,
  Divider,
} from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

function MinusAddon(props: any) {
  return (
    <Grid item md={12}>
      <Grid container justify="center" alignItems="center">
        <Grid item style={{ width: "4%" }}>
          <IconButton onClick={() => props.onSelected(props.id)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Grid>
        <Grid item md={11} style={{ width: "96%" }}>
          <Divider />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default MinusAddon;
