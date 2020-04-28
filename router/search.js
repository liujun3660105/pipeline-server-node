const {getFeatureById, getXminfoByKey, getFeatureByGeom, getXmInfoById} = require("../controller/search");
const Router = require("koa-router");
const router = new Router();

//关键字查询
router.get('/getxminfobykey',getXminfoByKey);
router.get('/getfeaturebyid',getFeatureById);




//几何查询
router.get('/getfeaturebygeom',getFeatureByGeom);
router.get('/getxminfobyid',getXmInfoById);
// router.get('/getxminfobygeom',getXminfoByGeom);
// router.get('/getFeature',getFeature);
module.exports = router.routes();