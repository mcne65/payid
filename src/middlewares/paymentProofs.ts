import { Request, Response, NextFunction } from 'express'

import {
  parsePaymentProof,
  handlePaymentProof,
} from '../services/paymentProofs'
import HttpStatus from '../types/httpStatus'
import { handleHttpError } from '../utils/errors'

export default function receivePaymentProof(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const paymentProof = parsePaymentProof(req.body)
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
  if (!paymentProof) {
    return handleHttpError(
      HttpStatus.BadRequest,
      'Payment proof payload is invalid.',
      res,
    )
  }

  try {
    handlePaymentProof(paymentProof)
  } catch (err) {
    handleHttpError(
      HttpStatus.InternalServerError,
      'Server could not process receipt',
      res,
      err,
    )
  }

  return next()
}