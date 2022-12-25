import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from "@mui/material";

const AboutDialogText: React.FC<{children?: React.ReactNode}> = ({children}) => (
    <DialogContentText sx={{marginTop: "16px", marginBottom: "16px"}}>{children}</DialogContentText>
);

const PERSONAL_WEB_LINK = "https://enreina.com";
const GITHUB_REPO_LINK = "https://github.com/enreina/ichibunzutsu";
const KUROSHIRO_LINK = "https://github.com/hexenq/kuroshiro";

export default function AboutDialog({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>About</DialogTitle>
            <DialogContent>
                <AboutDialogText>Ichi Bun Zutsu (literally means "one sentence at a time"; or so I hope) is a web app for Japanese reading practice.</AboutDialogText> 
                <AboutDialogText>It's a hobby project developed by <Link target="_blank" rel="noopener" href="https://enreina.com">@enreina</Link>, as a mean for her to learn TypeScript and Next.js (and of course, practice her Japanese reading). The source code of this web app is available on <Link target="_blank" rel="noopener" href="https://github.com/enreina/ichibunzutsu">GitHub</Link>.</AboutDialogText>
                <AboutDialogText>Displayed sentences come from the <Link target="_blank" rel="noopener" href="http://tatoeba.org/">Tatoeba</Link> project and are licensed under <Link target="_blank" rel="noopener" href="http://creativecommons.org/licenses/by/2.0/fr/">Creative Commons CC-BY</Link>.</AboutDialogText>
                <AboutDialogText>When WaniKani integration is set to on, the displayed sentences are provided by <Link target="_blank" rel="noopener" href="http://www.tofugu.com/">Tofugu</Link>'s kanji learning website <Link target="_blank" rel="noopener" href="http://www.wanikani.com/">WaniKani</Link> through their API.</AboutDialogText>
                <AboutDialogText>Furigana annotation are added by using the awesome <Link target="_blank" rel="noopener" href="https://github.com/hexenq/kuroshiro">kuroshiro</Link> library.</AboutDialogText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}