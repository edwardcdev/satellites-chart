import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  authcard: {
    marginTop: "10vh",
    minWidth: "30vw",
    padding: theme.spacing(3),
  },

  link: {
    paddingRight: theme.spacing(2),
    color: "#3385ff",
    textDecoration: "none",
  },

  cartCard: {
    padding: 0,
  },

  cartCardContent: {
    paddingRight: 0,
    paddingLeft: 0,
    overflowX: "hidden",
    height: "82vh",
    backgroundColor: grey[50]
  },

  chartCard: {
    padding: theme.spacing(3),
  },

  searchSelect: {
    textAlignLast: "center",
  },

  tooltip: {
    maxWidth: "500px",
  },

  dialogDeep: {
    minWidth: "43vw !important",
    height: "90vh !important",
    maxWidth: "40vw !important",
    backgroundColor: theme.palette.grey[100],
  },

  dashDialogDeep: {
    height: "93vh !important",
    minWidth: "80vw !important",
    maxWidth: "80vw !important",
    backgroundColor: theme.palette.grey[100],
  },

  dialogModify: {
    minWidth: "40vw !important",
    maxWidth: "40vw !important",
  },

  dialogCloseBtn: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100,
  },

  contentSection: {
    backgroundColor: grey[500],
    height: "100%",
    maxHeight: "55vh",
    overflow: "auto",
  },

  label: {
    fontSize: 14,
  },

  formControl: {
    margin: theme.spacing(1),
  },
}));

export default useStyles;
