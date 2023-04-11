import React from 'react'

const FullRankingModal = (props) => {

    return (

        <div className="modal fade" id={props.variant+"FullRankingModal"} tabIndex="-1" aria-labelledby="fullRankingModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{props.variant}</h5>
                    </div>
                    <div className="modal-body">
                        <ol>
                            {props.data}
                        </ol>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullRankingModal