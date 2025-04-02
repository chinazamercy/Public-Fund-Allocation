;; budget-approval.clar
;; This contract handles the approval and authorization of department budgets

(define-data-var admin principal tx-sender)

;; Data structure for department budgets
(define-map department-budgets
  { department-id: (string-ascii 64) }
  {
    amount: uint,
    approved: bool,
    fiscal-year: (string-ascii 10),
    approver: principal
  }
)

;; Public function to set a department budget
(define-public (set-department-budget (department-id (string-ascii 64)) (amount uint) (fiscal-year (string-ascii 10)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (map-set department-budgets
      { department-id: department-id }
      {
        amount: amount,
        approved: false,
        fiscal-year: fiscal-year,
        approver: tx-sender
      }
    ))
  )
)

;; Public function to approve a department budget
(define-public (approve-budget (department-id (string-ascii 64)))
  (let ((budget (unwrap! (map-get? department-budgets { department-id: department-id }) (err u404))))
    (begin
      (asserts! (is-eq tx-sender (var-get admin)) (err u403))
      (ok (map-set department-budgets
        { department-id: department-id }
        (merge budget { approved: true, approver: tx-sender })
      ))
    )
  )
)

;; Read-only function to get a department budget
(define-read-only (get-department-budget (department-id (string-ascii 64)))
  (map-get? department-budgets { department-id: department-id })
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)

;; Read-only function to get the current admin
(define-read-only (get-admin)
  (var-get admin)
)
