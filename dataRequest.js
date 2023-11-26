const axios = require("axios");

const jobList = {};
const getJobList = (data) => {
  data?.jobs.forEach((job) => {
	if (!(job.aptit_name in jobList)) {
	    jobList[job.aptit_name] = [];
	}
	jobList[job.aptit_name].push(job.job_nm);
  });
};

exports.getCareerNetJobData = async () => {
  let response = await axios.get(`https://www.career.go.kr/cnet/front/openapi/jobs.json?apiKey=${process.env.CAREERNET_SECRET}`);
  let index = 1;
  let maxPageIndex = Math.ceil(response?.data.count / response?.data.pageSize);
  for (const i of Array(maxPageIndex)) {
	response = await axios.get(`https://www.career.go.kr/cnet/front/openapi/jobs.json?apiKey=${process.env.CAREERNET_SECRET}&pageIndex=${index}`);
	getJobList(response.data);
	index++;
  }
  return jobList;
};