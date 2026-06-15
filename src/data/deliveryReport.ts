export const deliveryReport = {
  summary:
    "已完成登录后权限校验逻辑，并补充相关测试。采用 RBAC 策略，在中间件层统一拦截，覆盖角色权限判断与未授权访问防护。",
  changedFiles: [
    "authMiddleware.ts",
    "permissionService.ts",
    "userRole.ts",
    "authMiddleware.test.ts",
    "permissionService.test.ts",
  ],
  testResult: {
    passed: 28,
    failed: 0,
    coverageDelta: "+8.4%",
  },
  riskNotes: ["建议重点检查 Admin 角色权限范围是否符合产品预期"],
};

export const taskUnderstanding = {
  goal: "增加登录态识别、角色权限判断和接口权限拦截。",
  modules: ["authMiddleware.ts", "userRole.ts", "permissionService.ts"],
  testDir: "tests/auth/",
  risks: ["Admin 权限", "组织级权限", "未授权访问"],
  workflow: "功能开发 + 测试 + 安全审查 + Review",
};

export const DEFAULT_TASK_TEXT =
  "为当前项目增加用户登录后的权限校验，并补充对应测试。";

export const DEFAULT_INTERVENE_TEXT =
  "Admin 角色应该默认拥有全部权限，不要走普通用户权限限制逻辑。";
