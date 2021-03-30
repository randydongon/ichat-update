// // import React, { useState, useEffect } from 'react';
// // import { FaAngleDoubleRight } from 'react-icons/fa';
// // const url = 'https://course-api.netlify.app/api/react-tabs-project';

// import React, { useState, useEffect } from 'react'
// import { FaAngleDoubleRight } from 'react-icons/fa'
// // ATTENTION!!!!!!!!!!
// // I SWITCHED TO PERMANENT DOMAIN
// const url = 'https://xxxx.com/'
// function App() {
// const [loading, setLoading] = useState(true);
// const [jobs, setJobs] = useState([]);
// const [value, setValue] = useState(0);
// // const [loading, setLoading] = useState(true)
// // const [jobs, setJobs] = useState([])
// // const [value, setValue] = useState(0)

// const fetchJobs = async () => {
// const reponse = await fetch(url);
// const newJobs = await reponse.json();

// setJobs(newJobs);
// setLoading(false);
// };
// // const reponse = await fetch(url)
// // const newJobs = await reponse.json()
// setJobs(newJobs)
// setLoading(false)
// }
// useEffect(() => {
// fetchJobs();
// }, []);

// // fetchJobs()
// // }, [])
// if (loading) {
// return (
// {/* <section className="section loading"> */}
// < >
// <h1>Loading...</h1>
// </>
// }
// const { company, dates, duties, title } = jobs[value];
// const { company, dates, duties, title } = jobs[value]
// return (
// <section className="section">
// <div className="title">
// <section className='section'>
// <div className='title'>
// <h2>expierence</h2>
// <div className="underline"></div>
// <div className='underline'></div>
// </div>
// <div className="jobs-center">
// <div className='jobs-center'>
// {/ btn container /}
// <div className="btn-container">
// <div className='btn-container'>
// {jobs.map((item, index) => {
// return (
// <button
// @@ -42,29 +43,29 @@
// function App() {
// >
// {item.company}
// </button>
// );
// )
// })}
// </div>
// {/ job info /}
// <article className="job-info">
// <article className='job-info'>
// <h3>{title}</h3>
// <h4>{company}</h4>
// <p className="job-date">{dates}</p>
// <p className='job-date'>{dates}</p>
// {duties.map((duty, index) => {
// return (
// <div key={index} className="job-desc">
// <FaAngleDoubleRight className="job-icon"></FaAngleDoubleRight>
// <div key={index} className='job-desc'>
// <FaAngleDoubleRight className='job-icon'></FaAngleDoubleRight>
// <p>{duty}</p>
// </div>
// );
// )
// })}
// </article>
// </div>
// <button type="button" className="btn">
// <button type='button' className='btn'>
// more info
// </button>
// </section>
// );
// )
// }

// export default App;
// export default App
