import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  makeStyles,
  Theme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { Accordion, AccordionSummary, AccordionDetails } from './CustomAccordion';

interface IModelDetailsProps {
  expanded: string;
  system: number;
  onChangeSystem(param: number): void;
  onChange(parameter: string): void;
}

interface Model {
  MODEL_ID: number;
  BEAM_TYPE_STK: string;
}

interface Beam {
  BEAM_TYPE_STK: string;
}

interface StateValue {
  beam: string;
  model: number;
}

const INIT_VALUES = { beam: '', model: -1 };

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1)
  },
  font: {
    fontSize: '14px'
  }
}));

const ModelDetails: React.FC<IModelDetailsProps> = (props) => {
  const [values, setValues] = useState<StateValue>(INIT_VALUES);
  const [beams, setBeams] = useState<Beam[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isNew, setIsNew] = useState<boolean>(false);
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    fetchModels();
    fetchBeams();
  }, [props.system]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchModels = async () => {
    try {
      const params = { system: props.system };
      const response = await axios.get('/api/get-modify-models', { params });
      const value = response.data.length > 0 ? response.data[0].MODEL_ID : -1;

      setModels(response.data);
      setValues((prevState) => ({ ...prevState, model: value }));
      fetchSystem();
    } catch (error) {
      setModels([]);
    }
  };

  const fetchBeams = async () => {
    try {
      const response = await axios.get('/api/get-modify-beams');
      const value =
        response.data.length > 0 &&
        response.data.find((item: Beam) => Boolean(item.BEAM_TYPE_STK)).BEAM_TYPE_STK;

      setBeams(response.data);
      setValues((prevState) => ({ ...prevState, beam: value }));
      fetchSystem();
    } catch (error) {
      setBeams([]);
    }
  };

  const fetchSystem = async () => {
    const response = await axios.get('/api/get-modify-systems');
    const value = response.data.length > 0 ? response.data[0].SYSTEM_ID : -1;
    props.onChangeSystem(value);
  };

  const handleCreateModel = async () => {
    const beam = models.find((item) => item.MODEL_ID === values.model)?.BEAM_TYPE_STK;
    if (beam) {
      const params = { system_id: props.system, beam };
      await axios.post('/api/create-model', params);
      fetchModels();
      setIsNew(true);
    }
  };

  return (
    <Accordion
      square
      expanded={props.expanded === 'panel2'}
      onChange={() => props.onChange('panel2')}
    >
      <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
        <Typography>{'2. Model Details'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md={8}>
            <Typography style={{ fontSize: '14px' }}>
              a. Select the applicable model ID or select new for a new version to be
              automatically assigned.
            </Typography>
          </Grid>
          <Grid item md={4}>
            <FormControl
              variant="outlined"
              size="small"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel>{`Model`}</InputLabel>
              <Select
                name="model"
                value={values.model}
                label="Model"
                defaultValue=""
                onChange={handleChange}
              >
                <MenuItem value={-1} disabled>{`Choose Model`}</MenuItem>
                {models.map((item: Model) => (
                  <MenuItem value={item.MODEL_ID} key={`${item.MODEL_ID}`}>
                    {item.MODEL_ID}
                  </MenuItem>
                ))}
                <MenuItem value={-2} onClick={handleCreateModel}>
                  New
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={8}>
            <Typography style={{ fontSize: '14px' }}>
              b. Select STK model type.
            </Typography>
          </Grid>
          <Grid item md={4}>
            <FormControl
              variant="outlined"
              size="small"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel>Beam forming</InputLabel>
              <Select
                name="beam"
                value={values.beam}
                label="Beam forming"
                defaultValue=""
                onChange={handleChange}
              >
                <MenuItem value="" disabled>{`Choose Beam`}</MenuItem>
                {beams.map((item: Beam) => (
                  <MenuItem value={item.BEAM_TYPE_STK} key={`${item.BEAM_TYPE_STK}`}>
                    {item.BEAM_TYPE_STK}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={8}>
            <Typography style={{ fontSize: '14px' }}>
              c. Download new model for uploading to Bit Bucket.
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Button name="load_model" size="small" variant="outlined" disabled={!isNew}>
              Load Model
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ModelDetails;
