import React, { Component } from "react"

class Footer extends Component {
    render() {
        return (
            <footer className="footer bg-dark">
                <div id="jp_container_N">
                    <div className="jp-type-playlist">
                        <div id="jplayer_N" className="jp-jplayer hide" />
                        <div className="jp-gui">
                            <div className="jp-video-play hide">
                                <a href="/#" className="jp-video-play-icon">
                                    play
                                </a>
                            </div>
                            <div className="jp-interface">
                                <div className="jp-controls">
                                    <div>
                                        <a href="/#" className="jp-previous">
                                            <i className="icon-control-rewind i-lg" />
                                        </a>
                                    </div>
                                    <div>
                                        <a href="/#" className="jp-play">
                                            <i className="icon-control-play i-2x" />
                                        </a>
                                        <a href="/#" className="jp-pause hid">
                                            <i className="icon-control-pause i-2x" />
                                        </a>
                                    </div>
                                    <div>
                                        <a href="/#" className="jp-next">
                                            <i className="icon-control-forward i-lg" />
                                        </a>
                                    </div>
                                    <div className="hide">
                                        <a href="/#" className="jp-stop">
                                            <i className="fa fa-stop" />
                                        </a>
                                    </div>
                                    <div>
                                        <a href="/#" data-toggle="dropdown" data-target="#playlist">
                                            <i className="icon-list" />
                                        </a>
                                    </div>
                                    <div className="jp-progress hidden-xs">
                                        <div className="jp-seek-bar dk">
                                            <div className="jp-play-bar bg-info" />
                                            <div className="jp-title text-lt">
                                                <ul>
                                                    <li />
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-current-time text-xs text-muted" />
                                    <div className="hidden-xs hidden-sm jp-duration text-xs text-muted" />
                                    <div className="hidden-xs hidden-sm">
                                        <a href="/#" className="jp-mute" title="mute">
                                            <i className="icon-volume-2" />
                                        </a>
                                        <a href="/#" className="jp-unmute hid" title="unmute">
                                            <i className="icon-volume-off" />
                                        </a>
                                    </div>
                                    <div className="hidden-xs hidden-sm jp-volume">
                                        <div className="jp-volume-bar dk">
                                            <div className="jp-volume-bar-value lter" />
                                        </div>
                                    </div>
                                    <div>
                                        <a href="/#" className="jp-shuffle" title="shuffle">
                                            <i className="icon-shuffle text-muted" />
                                        </a>
                                        <a
                                            href="/#"
                                            className="jp-shuffle-off hid"
                                            title="shuffle off"
                                        >
                                            <i className="icon-shuffle text-lt" />
                                        </a>
                                    </div>
                                    <div>
                                        <a href="/#" className="jp-repeat" title="repeat">
                                            <i className="icon-loop text-muted" />
                                        </a>
                                        <a
                                            href="/#"
                                            className="jp-repeat-off hid"
                                            title="repeat off"
                                        >
                                            <i className="icon-loop text-lt" />
                                        </a>
                                    </div>
                                    <div className="hide">
                                        <a href="/#" className="jp-full-screen" title="full screen">
                                            <i className="fa fa-expand" />
                                        </a>
                                        <a
                                            href="/#"
                                            className="jp-restore-screen"
                                            title="restore screen"
                                        >
                                            <i className="fa fa-compress text-lt" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="jp-playlist dropup" id="playlist">
                            <ul className="dropdown-menu aside-xl dker">
                                {/* The method Playlist.displayPlaylist() uses this unordered list */}
                                <li className="list-group-item" />
                            </ul>
                        </div>
                        <div className="jp-no-solution hide">
                            <span>Update Required</span>
                            To play the media you will need to either update your browser to a
                            recent version or update your{" "}
                            <a href="http://get.adobe.com/flashplayer/">Flash plugin</a>.
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer
