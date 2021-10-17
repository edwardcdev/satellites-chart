import React, { useState, FC, useEffect, MouseEvent } from 'react';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import {
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Tooltip,
  IconButton,
  colors,
  makeStyles,
  Theme
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import ShopTwoOutlinedIcon from '@material-ui/icons/ShopTwoOutlined';
import axios from 'src/utils/axios';
import ProcessModal from './ProcessModal';
import ConfrimModal from './ConfirmModal';

interface IModel {
  MODEL_ID: number;
  BEAM_TYPE_STK: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: colors.grey[300],
    minHeight: '6vh'
  },
  formControl: {
    margin: theme.spacing(1)
  },
  systemForm: {
    width: '40%'
  },
  versionForm: {
    width: '20%',
    marginLeft: theme.spacing(1)
  },
  space: {
    marginLeft: theme.spacing(2)
  },
  uploadBtn: {
    backgroundColor: colors.blue[500],
    color: '#fff',
    padding: '0.3rem',
    borderRadius: 6
  }
}));

const HeaderSection: FC<any> = (props: any) => {
  const [model, setModel] = useState<number>(-1);
  const [models, setModels] = useState<IModel[]>([]);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isModal, setModal] = useState<boolean>(false);
  const [isAgree, setAgree] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [feature, setFeature] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    if (isAgree) {
      if (feature === 'delete') {
        handleDelete();
      } else if (feature === 'deteteAll') {
        handleAlldelete();
      } else {
        handleMigrate();
      }
      setFeature(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAgree]);

  useEffect(() => {
    setDisabled(props.db === 'product_db');
  }, [props.db]);

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.system]);

  const handleOpen = () => setOpen(!isOpen);

  const handleAgree = () => setAgree(!isAgree);

  const handleModal = () => setModal(!isModal);

  const handleChangeModel = (event) => setModel(event.target.value);

  const handleClick = (event: MouseEvent) => {
    const name = event.currentTarget.getAttribute('name');
    setFeature(name);
    setModal(!isModal);
  };

  const fetchModels = async () => {
    try {
      const params = { system: props.system };
      const response = await axios.get('/api/get-modify-models', { params });
      const model = response.data.length > 0 ? response.data[0].MODEL_ID : -1;

      setModels(response.data);
      setModel(model);
    } catch (error) {
      setModels([]);
    }
  };

  const handleDelete = async (): Promise<void> => {
    const params = {
      system: props.system,
      version: props.version,
      alt: props.alt,
      inc: props.inc,
      fileId: props.fileId
    };

    try {
      await axios.post('/api/delete-record', params);
      enqueueSnackbar('Selected record deleted successfully!', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar('Failed to remove record', {
        variant: 'error'
      });
    } finally {
      props.onRefresh();
    }
  };

  const handleAlldelete = async (): Promise<void> => {
    const params = {
      system: props.system,
      version: props.version
    };

    try {
      await axios.post('/api/delete-all', params);
      enqueueSnackbar('All records deleted successfully for selected system!', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar('Failed to remove all records', {
        variant: 'error'
      });
    } finally {
      props.onRefresh();
    }
  };

  const handleMigrate = async (): Promise<void> => {
    const params = {
      system: props.system,
      version: props.version
    };

    try {
      await axios.post('/api/migrate', params);
      enqueueSnackbar('Transfer Successful!', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar('Failed to transfer', {
        variant: 'error'
      });
    } finally {
      props.onRefresh();
    }
  };

  return (
    <>
      <Grid item md={12}>
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          spacing={1}
          className={classes.root}
        >
          <Grid item md={2} className={classes.space}>
            <Grid container justify="center" alignItems="center" spacing={2}>
              <Grid item md={3}>
                <IconButton onClick={handleOpen}>
                  <CloudUploadIcon fontSize="large" className={classes.uploadBtn} />
                </IconButton>
              </Grid>
              <Grid item md={9}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="database-select-label">{`DataBase`}</InputLabel>
                  <Select
                    labelId="database-select-label"
                    id="database-select-outlined"
                    value={props.db}
                    onChange={(e) => props.onSetDB(e.target.value)}
                    defaultValue=""
                    label="DataBase"
                  >
                    <MenuItem key="staging_db" value="staging_db">
                      Staging
                    </MenuItem>
                    <MenuItem key="product_db" value="product_db">
                      Production
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={1}>
            <Grid container justify="center" alignItems="center">
              <Grid item md={4}>
                <Tooltip
                  title="Delete selected record"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="delete" disabled={disabled} onClick={handleClick}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4}>
                <Tooltip
                  title="Delete all records for selected system"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="deleteAll" disabled={disabled} onClick={handleClick}>
                    <DeleteSweepOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4}>
                <Tooltip
                  title="Transfer all records to Production"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="migrate" disabled={disabled} onClick={handleClick}>
                    <ShopTwoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3}>
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.systemForm)}
            >
              <InputLabel id="header-select-system-label">System</InputLabel>
              <Select
                labelId="header-select-system-label"
                id="header-select-system"
                value={props.system}
                onChange={(e) => props.onSystem(e.target.value)}
                defaultValue=""
                label="System"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {props.systems.map((item: any) => (
                  <MenuItem key={item.system_name} value={item.system_id}>
                    {item.system_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.versionForm)}
            >
              <InputLabel id="header-select-version-label">{`Version`}</InputLabel>
              <Select
                labelId="header-select-version-label"
                id="header-select-version"
                value={props.version}
                onChange={(e) => props.onVersion(e.target.value)}
                defaultValue=""
                label="Version"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {props.versions.map((item: any) => (
                  <MenuItem key={`version_${item.versions}`} value={item.versions}>
                    {item.versions}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.versionForm)}
            >
              <InputLabel>Model</InputLabel>
              <Select
                label="Model"
                value={model}
                onChange={handleChangeModel}
                defaultValue=""
              >
                <MenuItem value={-1} disabled>
                  <em>None</em>
                </MenuItem>
                {models.map((item: any) => (
                  <MenuItem value={item.MODEL_ID} key={item.MODEL_ID}>
                    {item.MODEL_ID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3} className={classes.space}>
            <ToggleButtonGroup value={props.dataSet} onChange={(e) => props.onClick(e)}>
              <ToggleButton
                id="as_needed_handoff"
                name="coverage"
                value="as_needed_handoff"
                size="small"
              >
                RF Coverage (%)
              </ToggleButton>
              <ToggleButton
                id="maximum_powee_handoff"
                name="gap"
                value="maximum_powee_handoff"
                size="small"
              >
                No Coverage (%)
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <ProcessModal isOpen={isOpen} onClose={handleOpen} />
      <ConfrimModal
        open={isModal}
        name={feature}
        onClose={handleModal}
        onChangeAgree={handleAgree}
      />
    </>
  );
};

export default HeaderSection;
