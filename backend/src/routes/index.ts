import express from 'express';

import calendarRouter from './calendar.router';
import calendarItemRouter from './calendarItem.router';
import levelRouter from './level.router';
import roomRouter from './room.router';
import scheduleRouter from './schedule.router';
import schoolRouter from './school.router';
import sessionRouter from './session.router';
// import studentRouter from './student.router';
import subjectRouter from './subject.router';
// import routers
import userRouter from './user.route';

// define router
const router = express.Router();


router.use('/users', userRouter)
router.use('/school', schoolRouter)
router.use('/room', roomRouter)
router.use('/session', sessionRouter)
router.use('/subject', subjectRouter)
// router.use('/student', studentRouter)
router.use('/level', levelRouter)
router.use('/schedule', scheduleRouter)
router.use('/calendar', calendarRouter)



router.use('/calendaritem', calendarItemRouter)







export default router;