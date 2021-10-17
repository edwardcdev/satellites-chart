import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  makeStyles,
  Theme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import CreateSystemModel from './CreateSystemModal';
import { Accordion, AccordionSummary, AccordionDetails } from './CustomAccordion';

interface ISystemDetailsProps {
  expanded: string;
  system: number;
  onChange(param: string): void;
  onChangeSystem(param: number): void;
}

interface ISystem {
  SYSTEM_ID: number;
  SYSTEM_NAME: string;
}

interface IVersion {
  SYSTEM_VERSION: number;
}

interface IAttrVersion {
  SYSTEM_ATTRIBUTE_VERSION_ID: number;
}

interface StateValues {
  threshold: number | string;
  type: string;
  version: number;
  attrVersion: number;
}

const INIT_STATE = {
  threshold: '',
  type: 'stk',
  version: -1,
  attrVersion: -1
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1)
  },
  font: {
    fontSize: '14px'
  }
}));

const SystemDetails: React.FC<ISystemDetailsProps> = (props) => {
  const [values, setValues] = useState<StateValues>(INIT_STATE);
  const [systems, setSystems] = useState<ISystem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<IVersion[]>([]);
  const [attrVersions, setAttrVersions] = useState<IAttrVersion[]>([]);
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    fetchSystem();
  }, []);

  useEffect(() => {
    const name = systems.find((item) => item.SYSTEM_ID === props.system)?.SYSTEM_NAME;
    const fetchData = async () => {
      try {
        const params = { system_id: props.system, system_name: name };
        const response = await axios.get('/api/get-modify-versions', { params });
        const value = response.data.length > 0 ? response.data[0].SYSTEM_VERSION : -1;

        setVersions(response.data);
        setValues((prevState) => ({ ...prevState, version: value }));
      } catch (error) {
        setVersions([]);
      }
    };
    props.system > 0 && name && fetchData();
  }, [props.system, systems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { system: props.system, version: values.version };
        const response = await axios.get('/api/get-modify-attr-versions', { params });
        const value =
          response.data.length > 0 ? response.data[0].SYSTEM_ATTRIBUTE_VERSION_ID : -1;

        setAttrVersions(response.data);
        setValues((prevState) => ({ ...prevState, attrVersion: value }));
      } catch (error) {
        setAttrVersions([]);
      }
    };

    props.system > 0 && values.version > 0 && fetchData();
  }, [props.system, values.version, versions, systems]);

  const handleClose = () => {
    setOpen(!open);
    fetchSystem();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchSystem = async () => {
    try {
      const response = await axios.get('/api/get-modify-systems');
      const value = response.data.length > 0 ? response.data[0].SYSTEM_ID : -1;

      setSystems(response.data);
      props.onChangeSystem(value);
    } catch (error) {
      setSystems([]);
    }
  };

  const handleCreateVersion = async () => {
    const name = systems.find((item) => item.SYSTEM_ID === props.system)?.SYSTEM_NAME;
    if (name) {
      const params = { system_id: props.system, system_name: name };
      await axios.post('/api/create-version', params);
      fetchSystem();
    }
  };

  return (
    <>
      <Accordion
        square
        expanded={props.expanded === 'panel1'}
        onChange={() => props.onChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{'1. System Details'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item md={8}>
              <Typography className={classes.font}>a. Select type of file</Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>File Type</InputLabel>
                <Select
                  name="type"
                  value={values.type}
                  label="File Type"
                  defaultValue=""
                  onChange={handleChange}
                >
                  <MenuItem value="stk">STK</MenuItem>
                  <MenuItem value="ns3">NS3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={8}>
              <Typography className={classes.font}>
                b. Select the applicable system or enter new to enter a new system
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>System</InputLabel>
                <Select
                  value={props.system}
                  label="System"
                  defaultValue=""
                  onChange={(e: any) => props.onChangeSystem(e.target.value as number)}
                >
                  <MenuItem value={-1} disabled>{`Choose System`}</MenuItem>
                  {systems.map((item: ISystem) => (
                    <MenuItem
                      value={item.SYSTEM_ID}
                      key={`${item.SYSTEM_NAME}-${item.SYSTEM_ID}`}
                    >
                      {item.SYSTEM_NAME}
                    </MenuItem>
                  ))}
                  <MenuItem value={-2} onClick={handleClose}>
                    {`New`}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={8}>
              <Typography className={classes.font}>
                c. Select the applicable system version or select new for a new version to
                be automatically assigned.
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>Version</InputLabel>
                <Select
                  name="version"
                  value={values.version}
                  label="Version"
                  defaultValue=""
                  disabled={values.type === 'ns3'}
                  onChange={handleChange}
                >
                  <MenuItem value={-1} disabled>
                    Choose Version
                  </MenuItem>
                  {versions.map((item: IVersion) => (
                    <MenuItem
                      value={item.SYSTEM_VERSION}
                      key={`version-${props.system}-${item.SYSTEM_VERSION}`}
                    >
                      {item.SYSTEM_VERSION}
                    </MenuItem>
                  ))}
                  {systems.length > 0 && (
                    <MenuItem value={-2} onClick={handleCreateVersion}>
                      New
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={8}>
              <Typography className={classes.font}>
                d. Select the applicable CART attribute version.
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>{`Attribute Version`}</InputLabel>
                <Select
                  name="attrVersion"
                  value={values.attrVersion}
                  label="Attribute Version"
                  defaultValue=""
                  onChange={handleChange}
                >
                  <MenuItem value={-1} disabled>{`Choose Attribute Version`}</MenuItem>
                  {attrVersions.map((item: IAttrVersion) => (
                    <MenuItem
                      value={item.SYSTEM_ATTRIBUTE_VERSION_ID}
                      key={`attr-version-${props.system}-${values.version}-${item.SYSTEM_ATTRIBUTE_VERSION_ID}`}
                    >
                      {item.SYSTEM_ATTRIBUTE_VERSION_ID}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={8}>
              <Typography className={classes.font}>
                e. Select Power threshold value(Prec)
              </Typography>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="threshold"
                label="Power Threshold"
                value={values.threshold}
                variant="outlined"
                size="small"
                className={classes.formControl}
                type="number"
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <CreateSystemModel open={open} onClose={handleClose} />
    </>
  );
};

export default SystemDetails;
