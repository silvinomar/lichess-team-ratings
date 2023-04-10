import React from 'react'

const Footer = (props) => {

    return (
        <footer className='container-fluid text-light bg-dark text-center mt-5'>
            <section className='team-name py-4 m-0 mt-5 lead'>
                <p className='small'>
                    Last update: {props.date.slice(4, 24)}
                </p>
            </section>
            <p className='pb-3 m-0'>created by <i>silvinomar</i></p>
        </footer>
    )
}

export default Footer