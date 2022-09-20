import "reflect-metadata";
import { Request, Response } from "express";
import groupBy from "lodash/groupBy";
import moment from "moment";
import { MoreThan } from "typeorm";
import AppDataSource from "./../data-source";
import { ascmcounts } from "./../entity/ascmcounts";
import { ascmfeed_v2 } from "./../entity/ascmfeed_v2";

export const list = async (req: Request, res: Response) => {
  const { interval = "1h" } = req.body || {};
  const ascmFeedRepo = AppDataSource.getRepository(ascmfeed_v2);
  const ascmCountsRepo = AppDataSource.getRepository(ascmcounts);
  let heads = [];
  let submitted = [];
  let data = [];

  if (interval === "1h") {
    let takingLast = false;
    heads = await ascmFeedRepo.findBy({
      // take: 60,
      index: MoreThan(new Date(moment().subtract("60", "minutes").toString())),
    });
    if (heads.length === 0) {
      heads = await ascmFeedRepo.find({
        take: 60,
      });
      takingLast = true;
    }

    if (takingLast) {
      submitted = await ascmCountsRepo.find({
        take: 60,
      });
    } else {
      submitted = await ascmCountsRepo.findBy({
        // submit_date: MoreThan(new Date("2022-05-27 06:35:24")),
        submit_date: MoreThan(
          new Date(moment().subtract("60", "minutes").toString())
        ),
      });
    }
    let grp = groupBy(submitted, (x) =>
      moment(x.submit_date).format("YYYY-MM-DD HH:mm")
    );

    submitted = Object.values(grp);
    data = heads.map((x, i) => {
      return {
        date: x.index,
        head: x.count || 0,
        submitted: submitted[i]?.length || 0,
      };
    });
  }

  res.status(200).json(data);
};

export const counts = async (req: Request, res: Response) => {
  const ascmFeedRepo = AppDataSource.getRepository(ascmfeed_v2);
  const ascmCountsRepo = AppDataSource.getRepository(ascmcounts);

  const queryForTotal = ascmFeedRepo
    .createQueryBuilder(ascmfeed_v2.name)
    .select("COUNT(*)", "count");

  const queryForSubmitted = ascmCountsRepo
    .createQueryBuilder(ascmcounts.name)
    .select("COUNT(*)", "count");

  const totalRecords = await queryForTotal.getRawOne().then((r) => r.count);
  const totalSubmittedRecords = await queryForSubmitted
    .getRawOne()
    .then((r) => r.count);

  const headCounts = await ascmFeedRepo.find({
    take: 10,
    select: {
      count: true,
    },
  });

  const surveyCounts = await ascmCountsRepo
    .createQueryBuilder(ascmcounts.name)
    .select("max(submit_date)", "session_start_date")
    .select("COUNT(*)", "count")
    .groupBy("minute(submit_date)")
    .getRawMany();

  res.json({
    headCounts: headCounts.map((d) => d.count),
    surveyCounts: surveyCounts.map((d) => Number(d.count)).splice(0, 10),
    total: Number(totalRecords),
    submitted: Number(totalSubmittedRecords),
    submittedPercentage: Number(
      (Number(totalSubmittedRecords) * 100) / (Number(totalRecords) || 1)
    ),
  });
};
