import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import * as Constants from "../../constants";
import { grey } from "@material-ui/core/colors";

function Selection(props: any) {
  return (
    <Menu
      anchorEl={props.anchorEl}
      keepMounted
      open={Boolean(props.anchorEl)}
      onClose={() => props.onAnchorEl(null)}
    >
      {Constants.MENU_ITEMS["as_needed_handoff"].map((el: any) => (
        <MenuItem
          id={el.id}
          key={el.id}
          onClick={() => props.onSelected(el.id)}
          style={{ backgroundColor: props.selected.includes(el.id) ? grey[300] : "" }}
        >
          {el.name}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default Selection;
