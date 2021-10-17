import React, { useState } from "react";
import { Grid, Typography, IconButton, Box } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import useStyles from "../../utils/styles";

const SECTIONS = [
  { id: "options", title: "Options" },
  { id: "metrics", title: "Metrics" },
];

function ContentAddon(props: any) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
    >
      <Grid item md={4}></Grid>
      <Grid item md={8}>
        <Typography component="p" style={{ textAlign: "end" }}>
          <IconButton
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            className="mt-2 mb-2"
            style={{ fontSize: 14 }}
          >
            {`Metrics`}
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Typography>
      </Grid>
      {isOpen && (
        <Grid item md={12} style={{ paddingRight: 5 }}>
          <Box
            borderColor="primary.main"
            border={2}
            borderRadius={5}
            padding={2}
            style={{ zIndex: 1000, backgroundColor: grey[300] }}
          >
            <Typography>
              {`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.`}
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default ContentAddon;
