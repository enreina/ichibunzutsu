import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';

const WANIKANI_TOKEN_LINK = "https://www.wanikani.com/settings/personal_access_tokens";

export default function APIKeyDialog({isOpen}: {isOpen: boolean}) {
    return (
        <Dialog open={isOpen}>
        <DialogTitle>Please input your WaniKani API Key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We currently fetch Japanese sentences from WaniKani. If you already have a WaniKani account, your API Key can be found <Link target="_blank" rel="noopener" href={WANIKANI_TOKEN_LINK}>here</Link>.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="wanikani-api-key"
            label="WaniKani APIv2 Key"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button>Proceed</Button>
        </DialogActions>
      </Dialog>
    );
}